'use strict';

define('game/core/OfflineCore', (require) => {
    const CellStatus = require('game/cell/status');
    const Core = require('game/core/Core');
    const GameBot = require('game/core/GameBot');
    const GameEvents = require('game/core/events');
    const MoveTimeHandler = require('game/core/MoveTimeHandler');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const SetupValidator = require('game/field/SetupValidator');

    const gameBus = require('game/core/bus');

    const MAX_SECONDS_TO_MOVE = 20;
    const BOT_MOVE_SECONDS = 1;

    return class OfflineCore extends Core {
        /**
         *
         */
        constructor() {
            super();

            this._push = new Push();
            this._moveTimeHamdler = new MoveTimeHandler();

            this._players = [];

            this._moveEnabled = true;
            this._userMoveInProgress = false;
            this._lastTimeout = null;
            // Счетчик времени хода
            this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        }

        /**
         * Игра заканчивается, когда только у одного игрока есть "живые" корабли.
         * @return {boolean}
         */
        isEndOfGame() {
            return this._player.shipsAliveCount === 0 ||
                this._players.filter((p) => p.shipsAliveCount !== 0).length === 1;
        }

        /**
         * Управляет рендерингом сообщения об окончании игры.
         */
        emitEndOfGame() {
            this._push.clear();

            const message = (this._player.shipsAliveCount) ? 'Вы выиграли!' : 'Вы проиграли (в голос) :(';

            const scoreboard = this._players.map((p) => {
                return {username: p.name, rank: p.score};
            }).sort((a, b) => a.rank - b.rank);

            gameBus.emit(GameEvents.END_OF_GAME, {scoreboard, message});
            console.log('EOG');
        }

        /**
         * Ход игрока.
         * @private
         */
        beginUserMove() {
            if (this._userMoveInProgress) return;

            const secPassed = () => {
                this._moveTimeCounter--;

                if (this._moveTimeCounter > 0) {
                    this._moveTimeHamdler.renderProgress(this._moveTimeCounter);
                    this._userMoveInProgress = true;
                    this._lastTimeout = setTimeout(secPassed, 1000);
                } else {
                    this._userMoveInProgress = false;
                    this._push.clear();
                    this.doBotsMove();
                }
            };

            this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
            this._moveTimeHamdler.renderProgress(this._moveTimeCounter);
            this._userMoveInProgress = true;
            this._lastTimeout = setTimeout(secPassed, 1000);
        }

        /**
         * Заканчивает ход пользователя (когда он уложился в срок).
         * @param {Number} i
         * @param {Number} j
         */
        endUserMove({i, j}) {
            gameBus.emit(GameEvents.DISABLE_SCENE);

            this._moveEnabled = false;
            this._userMoveInProgress = false;

            if (this.resolveMove({i, j, player: this._player})) {
                if (this._lastTimeout) {
                    clearTimeout(this._lastTimeout);
                    this._lastTimeout = null;
                }

                if (this.isEndOfGame()) {
                    this.emitEndOfGame();
                    return;
                }

                setTimeout(() => this.doBotsMove(), BOT_MOVE_SECONDS * 1000);
            } else {
                gameBus.emit(GameEvents.ENABLE_SCENE);
                this._moveEnabled = true;
            }
        }

        /**
         * Ходы ботов
         * @private
         */
        doBotsMove() {
            gameBus.emit(GameEvents.DISABLE_SCENE);

            if (this._lastTimeout) {
                clearTimeout(this._lastTimeout);
                this._lastTimeout = null;
            }

            let currentBotIdx = 0;

            const renderBotMove = () => {
                this._push.addMessage(`Игрок ${this._bots[currentBotIdx].name} ходит`);
                this._push.render({level: PushLevels.MSG_INFO});
            };

            const botMove = () => {
                const current = this._bots[currentBotIdx];
                const [i, j] = current.bot.makeMove();
                this.resolveMove({i, j, player: current});

                setTimeout(() => {
                    if (++currentBotIdx < this._bots.length) {
                        if (this.isEndOfGame()) {
                            this.emitEndOfGame();
                            return;
                        }

                        renderBotMove();
                        setTimeout(botMove, BOT_MOVE_SECONDS * 1000);
                    } else {
                        gameBus.emit(GameEvents.ENABLE_SCENE);
                        this._moveEnabled = true;
                        this.beginUserMove();
                    }
                }, BOT_MOVE_SECONDS * 1000);
            };

            renderBotMove();
            setTimeout(botMove, BOT_MOVE_SECONDS * 1000);
        }

        /**
         * Проверяет, что сюда можно ходить.
         * @param {Number} i
         * @param {Number} j
         * @param {Object} player
         * @return {boolean}
         */
        checkMoveCorrect({i, j, player}) {
            const gameFieldDim = player.gameField.length;

            if (i >= gameFieldDim || j >= gameFieldDim) {
                this._push.addMessage('Такой клетки нет на поле');
            } else {
                const cellStatus = player.gameField[i][j];

                switch (cellStatus) {
                case CellStatus.EMPTY:
                case CellStatus.BUSY:
                    return true;
                default:
                    this._push.addMessage('Эта клетка недоступна для выстрела');
                    break;
                }
            }

            this._push.render({level: PushLevels.MSG_ERROR});
            return false;
        }

        /**
         * Отдает результат хода (в кого попали, сколько раз, задели ли себя и т.п.).
         * @param {Number} i
         * @param {Number} j
         * @param {Object} player
         * @return {{}}
         */
        getMoveResult({i, j, player}) {
            const moveResult = {};

            moveResult.userMove = player.name === this._player.name;
            moveResult.destroyedSelf = false;
            moveResult.destroyedShipsCount = 0;
            moveResult.userAffected = false;

            for (let playerIdx = 0; playerIdx < this._players.length; playerIdx++) {
                const current = this._players[playerIdx];

                switch (current.gameField[i][j]) {
                case CellStatus.BUSY:
                    current.gameField[i][j] = CellStatus.DESTROYED;
                    player.gameField[i][j] = CellStatus.DESTROYED_OTHER;

                    current.shipsAliveCount -= 1;

                    if (current.name === player.name) {
                        moveResult.destroyedSelf = true;
                    } else {
                        moveResult.destroyedShipsCount ++;
                    }

                    if (current.name === this._player.name) {
                        moveResult.userAffected = true;
                    }

                    break;
                case CellStatus.EMPTY:
                    player.gameField[i][j] = CellStatus.MISSED;
                    break;
                default:
                    break;
                }
            }

            return moveResult;
        }

        /**
         * Дает фидбек по ходу.
         * @param {Number} i
         * @param {Number} j
         * @param {Object} player
         * @return {boolean}
         */
        resolveMove({i, j, player}) {
            if (!this.checkMoveCorrect({i, j, player})) {
                return false;
            }

            const moveResult = this.getMoveResult({i, j, player});

            let message = null;
            let level = null;
            let status = null;

            if (moveResult.destroyedSelf && moveResult.destroyedShipsCount === 0) {
                player.score -= 2;

                if (moveResult.userMove) {
                    message = 'Вы попали только по себе. Дизлайк, отписка :(';
                    level = PushLevels.MSG_ERROR;
                    status = CellStatus.DESTROYED;

                    gameBus.emit(GameEvents.SET_SCORE, this._player.score);
                } else {
                    message = `Игрок ${player.name} попал только по себе`;
                    level = PushLevels.MSG_WARNING;
                }
            } else if (moveResult.destroyedSelf && moveResult.destroyedShipsCount) {
                player.score += 2 * moveResult.destroyedShipsCount;

                if (moveResult.userMove) {
                    message = `${moveResult.destroyedShipsCount} X 2, молодца!`;
                    level = PushLevels.MSG_SUCCESS;
                    status = CellStatus.DESTROYED_OTHER;
                } else if (moveResult.userAffected) {
                    this._player.score -= 1;
                    message = 'По вам попали';
                    level = PushLevels.MSG_ERROR;
                    status = CellStatus.DESTROYED;
                } else {
                    message = `Игрок ${player.name} выбил ${moveResult.destroyedShipsCount} X 2`;
                    level = PushLevels.MSG_INFO;
                }
            } else if (moveResult.destroyedShipsCount) {
                player.score += moveResult.destroyedShipsCount;

                if (moveResult.userMove) {
                    message = `+${moveResult.destroyedShipsCount}`;
                    level = PushLevels.MSG_SUCCESS;
                    status = CellStatus.DESTROYED_OTHER;
                } else if (moveResult.userAffected) {
                    this._player.score -= 1;
                    message = 'По вам попали';
                    level = PushLevels.MSG_ERROR;
                    status = CellStatus.DESTROYED;
                } else {
                    message = `Игрок ${player.name} выбил ${moveResult.destroyedShipsCount}`;
                    level = PushLevels.MSG_INFO;
                }
            } else {
                if (moveResult.userMove) {
                    message = 'Вы никуда не попали';
                    level = PushLevels.MSG_INFO;
                    status = CellStatus.MISSED;
                } else {
                    message = `Игрок ${player.name} никуда не попал`;
                    level = PushLevels.MSG_INFO;
                }
            }

            if (message && level) {
                this._push.addMessage(message);
                this._push.render({level});
            }

            if (status) {
                gameBus.emit(GameEvents.DRAW, {i, j, status});
            }

            if (moveResult.userMove || moveResult.userAffected) {
                gameBus.emit(GameEvents.SET_SCORE, this._player.score);
            }

            return true;
        }

        /**
         * Начало игры.
         * @param {Array<string>} gameField
         * @param {Number} playersCount
         */
        start(gameField, playersCount) {
            const shipsLimit = SetupValidator.computeShipsLimit(gameField.length);

            this._players = [
                {
                    gameField,
                    score: 0,
                    shipsAliveCount: shipsLimit,
                    isUser: true,
                },
            ];

            for (let i = 0; i < playersCount - 1; i++) {
                const bot = new GameBot(gameField.length);

                this._players.push(
                    {
                        name: `Твоя мамаша-${i + 1}`,
                        gameField: bot.randomizeShips(),
                        score: 0,
                        shipsAliveCount: shipsLimit,
                        isUser: false,
                        bot,
                    }
                );
            }

            // Ссылка на не бота.
            this._player = this._players[0];
            this._bots = this._players.slice(1);

            this.beginUserMove();

            gameBus.on(GameEvents.REQUEST_GAME_PERMISSION, ({i, j}) => {
                if (!this._moveEnabled) {
                    console.log('no move you bastard');
                    return;
                }

                this.endUserMove({i, j});
            });
        }
    };
});
