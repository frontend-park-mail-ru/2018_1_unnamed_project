'use strict';

define('game/core/GameBot', (require) => {
    const SetupValidator = require('game/field/SetupValidator');
    const rand = require('random');

    return class GameBot {
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
            const shipsCount = SetupValidator.computeShipsLimit(this.fieldSize);

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
    };
});
