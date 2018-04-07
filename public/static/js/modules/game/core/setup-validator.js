'use strict';

define('game/core/SetupValidator', (require) => {
    const GameBus = require('game/core/bus');
    const GameEvents = require('game/core/events');
    const CellStatuses = require('game/code/CellStatuses');
    const GameFieldEvents = require('game/field/events');
    const Push = require('Push');
    const PushLevels = require('Push/levels');

    return class SetupValidator {
        /**
         * Constructor
         */
        constructor() {
            this._battlefield;
            this._push = new Push();
            GameFieldEvents.on(GameFieldEvents.START_GAME, (fieldSize) => prepareField(fieldSize));
            GameBus.on(GameEvents.REQUEST_SETUP_PERMISSION, (i, j) => fillCell(i, j));
            GameBus.on(GameEvents.REQUEST_FREE_PERMISSION, (i, j) => freeCell(i, j));
        }

        /**
         * Prepare field by empty cells
         * @param {*} fieldSize
         */
        prepareField(fieldSize) {
            this._battlefield = new Array(fieldSize)
                .fill(
                    new Array(fieldSize)
                        .fill(
                            CellStatuses.EMPTY
                        )
                );
        };

        /**
         * Try to fill cell or raise error
         * @param {int} i Row
         * @param {int} j Column
         */
        fillCell(i, j) {
            switch (this._battlefield[i][j]) {
            case CellStatuses.EMPTY:
                GameBus.emit(GameEvents.DRAW, i, j, CellStatuses.BUSY);
                push.render(PushLevels.ERROR);
                return;
            case CellStatuses.BUSY:
                push.addMessage('Ячейка уже занята!');
            case CellStatuses.DESTROYED:
                push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
            }
            push.render(PushLevels.ERROR);
        };

        /**
         * Try to free cell or raise error
         * @param {int} i Row
         * @param {int} j Column
         */
        freeCell(i, j) {
            switch (this._battlefield[i][j]) {
            case CellStatuses.EMPTY:
                push.addMessage('Ячейка уже свободна!');
            case CellStatuses.BUSY:
                GameBus.emit(GameEvents.DRAW, i, j, CellStatuses.EMPTY);
                return;
            case CellStatuses.DESTROYED:
                push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
            }
            push.render(PushLevels.ERROR);
        };
    };
});
