import {PushLevels} from '../components/message-container';
import {GameBot} from './bots/bot';
import {Core, GameFieldData} from './core';
import {IPlayer, MAX_SECONDS_TO_MOVE, PlayersArray} from './datatypes';
import {GameEvents} from './events';
import {CellStatus} from './field/cell/status';
import {SetupValidator} from './field/setup-validator';
import gameBus from './game-bus';
import {MoveTimeHandler} from './move-time-hanlder';

const BOT_MOVE_SECONDS = 2;

interface IMoveResult {
    isUserMove: boolean;
    isUserHit: boolean;
    isDestroyedSelf: boolean;
    destroyedShipsCount: number;
}

enum ResolveMoveResult {
    Missed,
    Wrong,
    Hit,
}

export class OfflineCore extends Core {
    private _players: PlayersArray;

    private _player: IPlayer;
    private _bots: PlayersArray;
    // Последний результат выполняния setTimeout для того,
    // чтобы его можно было отменить.
    private _lastTimeout;
    // Счетчик секунд, оставшихся дл конца хода.
    private _moveTimeCounter: number;
    // Можно ли ходить (пользователю).
    private _moveEnabled: boolean;
    // Флаг того, что пользователь ходит.
    private _userMoveInProgress: boolean;
    private _terminated;

    /**
     *
     */
    constructor() {
        super();

        this._players = [];

        this._lastTimeout = null;
        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        this._moveEnabled = true;
        this._userMoveInProgress = false;
        this._terminated = false;
    }

    /**
     * Игра заканчивается, когда только у одного игрока есть "живые" корабли.
     * @return {boolean}
     */
    isGameOver() {
        return this._player.shipsAliveCount === 0 ||
            this._players.filter((p) => p.shipsAliveCount !== 0).length === 1;
    }

    /**
     * Управляет рендерингом сообщения об окончании игры.
     */
    emitGameOver() {
        const scoreboard = this._players.map((p) => {
            return {username: p.username, rank: p.score};
        }).sort((a, b) => a.rank - b.rank);

        this.push
            .clear()
            .clearSharedMessages();

        this._terminated = true;

        const isWinner: boolean = !!this._player.shipsAliveCount;
        gameBus.emit(GameEvents.GameOver, {scoreboard, isWinner});
    }

    /**
     * Ход игрока.
     * @private
     */
    beginUserMove() {
        if (this._userMoveInProgress || this._terminated) return;

        this.push.clear();

        const secPassed = () => {
            this._moveTimeCounter--;

            if (this._moveTimeCounter > 0) {
                MoveTimeHandler.renderProgress(this._moveTimeCounter);
                this._userMoveInProgress = true;
                if (!this._terminated) {
                    this._lastTimeout = setTimeout(secPassed, 1000);
                }
            } else {
                this._userMoveInProgress = false;
                if (!this._terminated) this.doBotsMove();
            }
        };

        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        MoveTimeHandler.renderProgress(this._moveTimeCounter);
        this._userMoveInProgress = true;
        this._lastTimeout = setTimeout(secPassed, 1000);
    }

    /**
     * Заканчивает ход пользователя (когда он уложился в срок).
     * @param {Number} i
     * @param {Number} j
     */
    endUserMove({i, j}) {
        if (this._terminated) return;

        gameBus.emit(GameEvents.DisableScene);

        this._moveEnabled = false;
        this._userMoveInProgress = false;

        const moveResult = this.resolveMove({i, j, player: this._player});

        if (moveResult === ResolveMoveResult.Wrong) {
            gameBus.emit(GameEvents.EnableScene);
            this._moveEnabled = true;
        } else {
            if (this._lastTimeout) {
                clearTimeout(this._lastTimeout);
                this._lastTimeout = null;
            }

            if (this.isGameOver()) {
                this.emitGameOver();
                return;
            }

            if (moveResult === ResolveMoveResult.Hit) {
                gameBus.emit(GameEvents.EnableScene);
                this._moveEnabled = true;
                this._userMoveInProgress = false;
                this.beginUserMove();
            } else {
                setTimeout(() => this.doBotsMove(), BOT_MOVE_SECONDS * 1000);
            }
        }
    }

    /**
     * Ходы ботов
     * @private
     */
    doBotsMove() {
        gameBus.emit(GameEvents.DisableScene);

        MoveTimeHandler.renderProgress(MAX_SECONDS_TO_MOVE);

        clearTimeout(this._lastTimeout);

        if (this._terminated) return;

        let currentBotIdx = 0;

        const renderBotMove = () => {
            if (this._terminated)  {
                clearTimeout(this._lastTimeout);
                this.push.clearMessages();
                return;
            }

            if (this._bots[currentBotIdx].shipsAliveCount) {
                this.push.addMessage(`Игрок ${this._bots[currentBotIdx].username} ходит`);
            } else {
                this.push.addMessage(`Игрок ${this._bots[currentBotIdx].username} пропускает ход`);
            }
            this.push.render({level: PushLevels.Info});
        };

        const botMove = () => {
            if (this._terminated) return;

            const current = this._bots[currentBotIdx];
            if (current && current.shipsAliveCount) {
                const [i, j] = current.bot.makeMove();

                if (i === null ||
                    j === null ||
                    this.resolveMove({i, j, player: current}) === ResolveMoveResult.Missed) {
                    ++currentBotIdx;
                }
            } else {
                ++currentBotIdx;
            }

            setTimeout(() => {
                if (currentBotIdx < this._bots.length) {
                    if (this._terminated) return;

                    if (this.isGameOver()) {
                        this.emitGameOver();
                        return;
                    }

                    if (!this._bots[currentBotIdx]) {
                        clearTimeout(this._lastTimeout);
                        return;
                    }

                    renderBotMove();
                    setTimeout(botMove, BOT_MOVE_SECONDS * 1000);
                } else {
                    if (this._terminated) return;

                    gameBus.emit(GameEvents.EnableScene);
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
    checkMoveMissed({i, j, player}): boolean {
        const gameFieldDim = player.gameField.length;

        if (i >= gameFieldDim || j >= gameFieldDim) {
            this.push.addMessage('Такой клетки нет на поле');
        } else {
            const cellStatus = player.gameField[i][j];

            switch (cellStatus) {
                case CellStatus.Empty:
                case CellStatus.Busy:
                    return true;
                default:
                    this.push.addMessage('Эта клетка недоступна для выстрела');
                    break;
            }
        }

        this.push.render({level: PushLevels.Error});
        return false;
    }

    /**
     * Отдает результат хода (в кого попали, сколько раз, задели ли себя и т.п.).
     * @param {Number} i
     * @param {Number} j
     * @param {Object} player
     * @return {{}}
     */
    getMoveResult({i, j, player}): IMoveResult {
        const moveResult: IMoveResult = {
            isUserMove: player.username === this._player.username,
            isUserHit: false,
            isDestroyedSelf: false,
            destroyedShipsCount: 0,
        };

        for (const current of this._players) {
            switch (current.gameField[i][j]) {
                case CellStatus.Busy:
                    current.gameField[i][j] = CellStatus.Destroyed;
                    player.gameField[i][j] = CellStatus.DestroyedOther;

                    current.shipsAliveCount -= 1;

                    if (current.username === player.username) {
                        moveResult.isDestroyedSelf = true;
                    } else {
                        moveResult.destroyedShipsCount++;
                    }

                    if (current.username === this._player.username) {
                        moveResult.isUserHit = true;
                    }

                    break;
                case CellStatus.Empty:
                    player.gameField[i][j] = CellStatus.Missed;
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
    resolveMove({i, j, player}): ResolveMoveResult {
        if (this._terminated) return;

        if (!this.checkMoveMissed({i, j, player})) {
            return ResolveMoveResult.Wrong;
        }

        const moveResult = this.getMoveResult({i, j, player});

        let message = null;
        let level = null;
        let status = null;

        let resolveMoveResult: ResolveMoveResult = ResolveMoveResult.Missed;

        if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount === 0) {
            player.score -= 2;

            if (moveResult.isUserMove) {
                message = 'Вы попали только по себе :(';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;

                gameBus.emit(GameEvents.SetScore, this._player.score);
            } else {
                message = `${player.username} попал только по себе`;
                level = PushLevels.Warning;
            }
        } else if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount) {
            player.score += 2 * moveResult.destroyedShipsCount;

            if (moveResult.isUserMove) {
                message = `${moveResult.destroyedShipsCount} X 2, молодца!`;
                level = PushLevels.Success;
                status = CellStatus.DestroyedOther;
            } else if (moveResult.isUserHit) {
                this._player.score -= 1;
                message = 'По вам попали';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;
            } else {
                message = `${player.username} выбил ${moveResult.destroyedShipsCount} X 2`;
                level = PushLevels.Info;
            }

            resolveMoveResult = ResolveMoveResult.Hit;
        } else if (moveResult.destroyedShipsCount) {
            player.score += moveResult.destroyedShipsCount;

            if (moveResult.isUserMove) {
                message = `+${moveResult.destroyedShipsCount}`;
                level = PushLevels.Success;
                status = CellStatus.DestroyedOther;
            } else if (moveResult.isUserHit) {
                this._player.score -= 1;
                message = 'По вам попали';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;
            } else {
                message = `${player.username} выбил ${moveResult.destroyedShipsCount}`;
                level = PushLevels.Info;
            }

            resolveMoveResult = ResolveMoveResult.Hit;
        } else {
            if (moveResult.isUserMove) {
                message = 'Вы никуда не попали';
                level = PushLevels.Info;
                status = CellStatus.Missed;
            } else {
                message = `${player.username} никуда не попал`;
                level = PushLevels.Info;
            }
        }

        if (message && level) {
            this.push.addMessage(message);
            this.push.render({level});
        }

        if (status) {
            gameBus.emit(GameEvents.Draw, {i, j, status});
        }

        if (moveResult.isUserMove || moveResult.isUserHit) {
            gameBus.emit(GameEvents.SetScore, this._player.score);
        }

        gameBus.emit(GameEvents.SetShipsLeft, this._player.shipsAliveCount);

        return resolveMoveResult;
    }

    start(username: string, gameField: GameFieldData, playersCount: number) {
        gameBus.emit(GameEvents.EnableScene);

        const shipsLimit = SetupValidator.computeShipsLimit(gameField.length);

        this._players = [
            {
                username,
                gameField,
                score: 0,
                shipsAliveCount: shipsLimit,
                isUser: true,
            },
        ];

        for (let i = 0; i < playersCount - 1; i++) {
            const bot = new GameBot(gameField.length);
            const botGameField = bot.randomizeShips();

            this._players.push(
                {
                    username: `Clone Trooper ${i + 1}`,
                    gameField: botGameField,
                    score: 0,
                    shipsAliveCount: shipsLimit,
                    isUser: false,
                    bot,
                },
            );
        }

        // Не бот.
        this._player = this._players[0];
        // Все боты.
        this._bots = this._players.slice(1);

        this.beginUserMove();

        this.push.clear();
        gameBus.emit(GameEvents.SetShipsLeft, this._player.shipsAliveCount);

        gameBus.on(GameEvents.RequestGamePermission, ({i, j}) => {
            if (!this._moveEnabled) {
                return;
            }

            this.endUserMove({i, j});
        });

        gameBus.on(GameEvents.Terminate, () => {
            clearTimeout(this._lastTimeout);
            this.emitGameOver();
        });
    }
}
