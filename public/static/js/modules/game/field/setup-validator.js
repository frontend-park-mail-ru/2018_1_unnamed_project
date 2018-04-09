'use strict';

define('game/field/SetupValidator', (require) => {
    const gameBus = require('game/core/bus');
    const gameEvents = require('game/core/events');
    const cellStatuses = require('game/cell/status');
    const Push = require('Push');
    const PushLevels = require('Push/levels');

    return class SetupValidator {
        /**
         * Constructor
         */
        constructor() {
            this._push = new Push();
            gameBus.on(gameEvents.CREATE_BATTLEFIELD, (fieldSize) => this.prepareField(fieldSize));
            gameBus.on(gameEvents.REQUEST_SETUP_PERMISSION, ({i, j}) => this.fillCell(i, j));
            gameBus.on(gameEvents.REQUEST_FREE_PERMISSION, ({i, j}) => this.freeCell(i, j));
        }

        /**
         * @param {Number} fieldSize
         * @return {Number} количество клеток на игрока
         */
        static computeShipsLimit(fieldSize) {
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
         * Prepare field by empty cells
         * @param {*} fieldSize
         */
        prepareField(fieldSize) {
            this._shipsLimit = SetupValidator.computeShipsLimit(fieldSize);
            this._battlefield = Array.from(Array(fieldSize), () => (new Array(fieldSize)).fill(cellStatuses.EMPTY));
        };

        /**
         * Try to fill cell or raise error
         * @param {int} i Row
         * @param {int} j Column
         */
        fillCell(i, j) {
            switch (this._battlefield[i][j]) {
            case cellStatuses.EMPTY:
                if (this._shipsLimit === 0) {
                    this._push.addMessage('Корабли закончились');
                    break;
                }
                this._battlefield[i][j] = cellStatuses.BUSY;
                this._shipsLimit--;
                gameBus.emit(gameEvents.DRAW, {i, j, status: cellStatuses.BUSY});
                this._push.clearMessages();
                break;
            case cellStatuses.BUSY:
                this._push.addMessage('Ячейка уже занята!');
                break;
            case cellStatuses.DESTROYED:
                this._push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
                break;
            default:
                break;
            }
            this._push.render({level: PushLevels.MSG_ERROR});
        };

        /**
         * Try to free cell or raise error
         * @param {int} i Row
         * @param {int} j Column
         */
        freeCell(i, j) {
            switch (this._battlefield[i][j]) {
            case cellStatuses.EMPTY:
                this._push.addMessage('Ячейка уже свободна!');
                break;
            case cellStatuses.BUSY:
                this._battlefield[i][j] = cellStatuses.EMPTY;
                this._shipsLimit++;
                gameBus.emit(gameEvents.DRAW, {i, j, status: cellStatuses.EMPTY});
                this._push.clearMessages();
                break;
            case cellStatuses.DESTROYED:
                this._push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
                break;
            default:
                break;
            }
            this._push.render({level: PushLevels.MSG_ERROR});
        };
    };
});
