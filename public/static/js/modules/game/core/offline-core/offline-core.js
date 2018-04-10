'use strict';

define('game/core/OfflineCore', (require) => {
    const CellStatus = require('game/cell/status');
    const Core = require('game/core/Core');
    const GameBot = require('game/core/GameBot');
    const GameEvents = require('game/core/events');
    const MoveTimeHandler = require('game/core/MoveTimeHandler');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const rand = require('random');

    const gameBus = require('game/core/bus');

    const MAX_SECONDS_TO_MOVE = 20;

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

            this.setStartGameHandler()
                .setMakeMoveHandler();
        }

        /**
         * @return {boolean}
         */
        isEndOfGame() {
            return false;
        }

        /**
         * Ход игрока.
         * @private
         */
        beginUserMove() {
            if (this._userMoveInProgress) return;

            const secPassed = () => {
                if (--this._moveTimeCounter) {
                    this._moveTimeHamdler.renderProgress(this._moveTimeCounter);
                    this._userMoveInProgress = true;
                    this._lastTimeout = setTimeout(secPassed, 1000);
                } else {
                    this._userMoveInProgress = false;
                    this._push.clear();
                    this.beginBotsMove();
                }
            };

            this._moveTimeHamdler.renderProgress(this._moveTimeCounter);
            this._userMoveInProgress = true;
            this._lastTimeout = setTimeout(secPassed, 1000);
        }

        /**
         * Ходы ботов
         * @private
         */
        beginBotsMove() {
            gameBus.emit(GameEvents.DISABLE_SCENE);

            if (this._lastTimeout) {
                clearTimeout(this._lastTimeout);
                this._lastTimeout = null;
            }

            if (this.isEndOfGame()) {
                console.log('EOG');
            }

            this._push.addMessage('Ходят боты');
            this._push.render({level: PushLevels.MSG_INFO});
        }

        /**
         * @param {Number} ms
         * @return {number}
         */
        setTimeout(ms) {
            console.log('BEGIN');

            this._moveEnabled = true;
            gameBus.emit(GameEvents.ENABLE_SCENE);
            return setTimeout(() => {
                console.log('END');

                this._moveEnabled = false;
                gameBus.emit(GameEvents.DISABLE_SCENE);
            }, ms);
        }

        /**
         * @private
         * @return {OfflineCore}
         */
        setStartGameHandler() {
            gameBus.on(GameEvents.START_OFFLINE_GAME, ({name, playersCount, gameField}) => {
                const maxShipCount = getMaxShipCount(gameField.length);

                this._players = [
                    {
                        name,
                        gameField,
                        score: 0,
                        shipsAliveCount: maxShipCount,
                        player: 'user',
                        isBot: false,
                    },
                ];

                for (let i = 0; i < playersCount - 1; i++) {
                    const bot = new GameBot(gameField.length);

                    this._players.push(
                        {
                            name: `bot${i + 1}`,
                            gameField: bot.randomizeShips(),
                            score: 0,
                            shipsAliveCount: maxShipCount,
                            player: bot,
                            isBot: true,
                        }
                    );
                }

                this.start();
            });
            return this;
        }

        /**
         * Игра.
         */
        start() {
            this.beginUserMove();
            // let endOfGame = false;
            //
            // this.currentPlayerIdx = 0;
            //
            // while (true) {
            //     if (endOfGame) {
            //         break;
            //     }
            //
            //     const player = this._players[this.currentPlayerIdx];
            //
            //     if (player.isBot) {
            //         const [i, j] = player.player.makeMove();
            //
            //         let destroyedShipsCount = 0;
            //         let selfDestroyed = false;
            //         let userDestroyed = false;
            //         let destroyed = false;
            //
            //         for (let i = 0; i < this._players.length; i++) {
            //             const current = this._players[i];
            //
            //             if (current.gameField[i][j] === CellStatus.BUSY) {
            //                 if (current.name === player.name) {
            //                     selfDestroyed = true;
            //                 } else {
            //                     if (current.name === this._players[this.currentPlayerIdx].name) {
            //                         userDestroyed = true;
            //                     }
            //                     destroyedShipsCount ++;
            //                 }
            //                 destroyed = true;
            //             }
            //         }
            //
            //         if (selfDestroyed && destroyedShipsCount === 0) {
            //             player.score -= 2;
            //         } else if (selfDestroyed && destroyedShipsCount !== 0) {
            //             player.score += destroyedShipsCount * 1.5;
            //         } else {
            //             player.score += destroyedShipsCount;
            //         }
            //
            //         if (userDestroyed) {
            //             gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.DESTROYED});
            //             continue;
            //         }
            //
            //         if (destroyed) {
            //             gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.DESTROYED_OTHER});
            //             continue;
            //         }
            //     }
            //
            //     endOfGame = this._players.filter((p) => p.shipsAliveCount !== 0).length === 1;
            //
            //     this.currentPlayerIdx = (++this.currentPlayerIdx) % this._players.length;
            // }
        }

        /**
         * @return {OfflineCore}
         */
        setMakeMoveHandler() {
            let lastTimeout = null;

            gameBus.on(GameEvents.REQUEST_GAME_PERMISSION, () => {
                // const player = this._players[this.currentPlayerIdx];
                // const push = new Push();

                if (!this._moveEnabled) {
                    console.log('no move you bastard');
                    return;
                }

                if (lastTimeout) {
                    clearTimeout(lastTimeout);
                }

                lastTimeout = this.setTimeout(2000);

                // switch (player.gameField[i][j]) {
                // case CellStatus.EMPTY:
                // case CellStatus.BUSY:
                //     // makeMove;
                //     push.clear();
                //
                //     if (!this._moveEnabled) {
                //         return;
                //     }
                //
                //     this.setTimeout(2000);
                //
                //     break;
                // default:
                //     push.addMessage('Нельзя стрелять в эту клетку');
                //     push.render({level: PushLevels.ERROR});
                //     break;
                // }
            });
            return this;
        }
    };
});
