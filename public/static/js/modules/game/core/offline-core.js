'use strict';

define('game/core/OfflineCore', (require) => {
    const CellStatus = require('game/cell/status');
    const GameEvents = require('game/core/events');
    const rand = require('random');

    const gameBus = require('game/core/bus');

    /**
     * @param {Number} fieldSize
     * @return {number}
     */
    function getMaxShipCount(fieldSize) {
        switch (fieldSize) {
        case 10:
            return 20;
        case 15:
            return 30;
        case 40:
            return 40;
        default:
            return 10;
        }
    }

    /**
     *
     */
    class GameBot {
        /**
         * @param {Number} fieldSize
         */
        constructor(fieldSize) {
            this.fieldSize = fieldSize;
            this._prevMoves = new Set();
        }

        /**
         * @return {Set<any>}
         */
        randomizeShips() {
            const ships = new Set();
            const shipsCount = getMaxShipCount(this.fieldSize);

            while (ships.size !== shipsCount) {
                const cell = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

                if (ships.has(cell)) {
                    continue;
                }

                ships.add(cell);
            }

            return ships;
        }

        /**
         * @note РЕФАКТОРИНГ!
         * @return {*[]}
         */
        makeMove() {
            let count = this.fieldSize * this.fieldSize;

            while (true) {
                const cell = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

                if (!this._prevMoves.has(cell)) {
                    this._prevMoves.add(cell);
                    return cell;
                }

                if (!--count) {
                    console.log('Бот слажал');
                    return null;
                }
            }
        }
    }

    return class OfflineCore {
        /**
         *
         */
        constructor() {
            this._players = [];

            this.setStartGameHandler();
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
            let endOfGame = false;

            this.currentPlayerIdx = 0;

            while (true) {
                if (endOfGame) {
                    break;
                }

                const player = this._players[this.currentPlayerIdx];

                if (player.isBot) {
                    const [i, j] = player.player.makeMove();

                    let destroyedShipsCount = 0;
                    let selfDestroyed = false;
                    let userDestroyed = false;
                    let destroyed = false;

                    for (let i = 0; i < this._players.length; i++) {
                        const current = this._players[i];

                        if (current.gameField[i][j] === CellStatus.BUSY) {
                            if (current.name === player.name) {
                                selfDestroyed = true;
                            } else {
                                if (current.name === this._players[this.currentPlayerIdx].name) {
                                    userDestroyed = true;
                                }
                                destroyedShipsCount ++;
                            }
                            destroyed = true;
                        }
                    }

                    if (selfDestroyed && destroyedShipsCount === 0) {
                        player.score -= 2;
                    } else if (selfDestroyed && destroyedShipsCount !== 0) {
                        player.score += destroyedShipsCount * 1.5;
                    } else {
                        player.score += destroyedShipsCount;
                    }

                    if (userDestroyed) {
                        gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.DESTROYED});
                        continue;
                    }

                    if (destroyed) {
                        gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.DESTROYED_OTHER});
                        continue;
                    }

                    // let cnt = 0;
                    // let drawToUser = false;
                    // let draw = false;
                    //
                    // this._players.forEach((p) => {
                    //     switch (p.gameField[i][j]) {
                    //     case CellStatus.BUSY:
                    //         cnt += 1;
                    //         draw = true;
                    //
                    //         if (p.name !== player.name) {
                    //             drawToUser = p.name === 'user';
                    //         }
                    //     case CellStatus.BUSY && p.name !== player.name:
                    //         p.gameField[i][j] = CellStatus.DESTROYED;
                    //         cnt += 1;
                    //         draw = true;
                    //     case CellStatus.BUSY && p.name === player.name:
                    //         p.gameField[i][j] = CellStatus.DESTROYED;
                    //         cnt -= 2;
                    //         draw = true;
                    //     }
                    // });
                }

                endOfGame = this._players.filter((p) => p.shipsAliveCount !== 0).length === 1;

                this.currentPlayerIdx = (++this.currentPlayerIdx) % this._players.length;
            }
        }
    };
});
