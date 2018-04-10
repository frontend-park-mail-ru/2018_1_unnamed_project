'use strict';

define('game/field/SetupValidator', (require) => {
    const CellStatus = require('game/cell/status');
    const GameEvents = require('game/core/events');
    const Push = require('Push');
    const PushLevels = require('Push/levels');

    const gameBus = require('game/core/bus');

    return class SetupValidator {
        /**
         * Constructor
         */
        constructor() {
            this._push = new Push();
            this._setupFinished = false;

            gameBus.on(GameEvents.CREATE_BATTLEFIELD, (fieldSize) => this.prepareField(fieldSize));
            gameBus.on(GameEvents.REQUEST_SETUP_PERMISSION, ({i, j}) => this.fillCell(i, j));
            gameBus.on(GameEvents.REQUEST_FREE_PERMISSION, ({i, j}) => this.freeCell(i, j));
        }

        /**
         * @param {Number} fieldSize
         * @return {Number} количество клеток на игрока
         */
        static computeShipsLimit(fieldSize) {
            switch (fieldSize) {
            case 10:
                return 10;
            case 15:
                return 30;
            case 20:
                return 40;
            default:
                return 10;
            }
        }

        /**
         * @return {*}
         */
        get battlefield() {
            if (this._shipsLimit) {
                throw new Error('Battlefield is not ready');
            }

            return this._battlefield;
        }

        /**
         * Prepare field by empty cells
         * @param {*} fieldSize
         */
        prepareField(fieldSize) {
            this._shipsLimit = SetupValidator.computeShipsLimit(fieldSize);

            this._push.addMessage('Расставьте корабли на поле. ЛКМ - поставить, ПКМ - убрать.');
            this._push.addMessage(`Доступно кораблей для расстановки: ${this._shipsLimit}`);
            this._push.render({level: PushLevels.MSG_INFO});

            this._battlefield = Array.from(Array(fieldSize), () => (new Array(fieldSize)).fill(CellStatus.EMPTY));
        };

        /**
         *
         */
        renderShipCount() {
            this._push.clearMessages();

            if (this._shipsLimit) {
                this._push.addMessage(`Доступно кораблей для расстановки: ${this._shipsLimit}`);
                this._push.render({level: PushLevels.MSG_INFO});
            } else {
                this._setupFinished = true;
                this._push.addMessage('Корабли расставлены! Нажмите > , чтобы начать игру');
                this._push.render({level: PushLevels.MSG_WARNING});
                gameBus.emit(GameEvents.DISABLE_SCENE);
            }
        }

        /**
         * Try to fill cell or raise error
         * @param {int} i Row
         * @param {int} j Column
         */
        fillCell(i, j) {
            if (this._setupFinished) return;

            switch (this._battlefield[i][j]) {
            case CellStatus.EMPTY:
                if (this._shipsLimit === 0) {
                    this._push.addMessage('Корабли закончились');
                    break;
                }
                this._battlefield[i][j] = CellStatus.BUSY;
                this._shipsLimit--;
                gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.BUSY});
                this.renderShipCount();
                return;
            case CellStatus.BUSY:
                this._push.addMessage('Ячейка уже занята!');
                break;
            case CellStatus.DESTROYED:
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
            if (this._setupFinished) return;

            switch (this._battlefield[i][j]) {
            case CellStatus.EMPTY:
                this._push.addMessage('Ячейка уже свободна!');
                break;
            case CellStatus.BUSY:
                this._battlefield[i][j] = CellStatus.EMPTY;
                this._shipsLimit++;
                gameBus.emit(GameEvents.DRAW, {i, j, status: CellStatus.EMPTY});
                this.renderShipCount();
                return;
            case CellStatus.DESTROYED:
                this._push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
                break;
            default:
                break;
            }
            this._push.render({level: PushLevels.MSG_ERROR});
        };
    };
});
