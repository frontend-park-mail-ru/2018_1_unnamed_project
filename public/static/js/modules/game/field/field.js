'use strict';

define('game/field/GameField', (require) => {
    const CalcDelegate = require('game/field/CalcDelegate');
    const Cell = require('game/field/cell/Cell');
    const Scene = require('graphics/Scene');

    const gameBus = require('game/core/bus');
    const gameEvents = require('game/core/events');

    /**
     * Игровое поле.
     */
    return class GameField {
        /**
         * @param {*} canvas
         */
        constructor(canvas) {
            this.canvas = canvas;

            const ctx = canvas.getContext('2d');
            this.ctx = ctx;

            this._scene = new Scene(ctx);
            this._calcDelegate = new CalcDelegate();

            this.setCoordMapper(gameEvents.LCLICK)
                .setCoordMapper(gameEvents.RCLICK);

            this.init();
        }

        /**
         * @return {*[]}
         */
        computeCellParams() {
            const fieldParams = this._calcDelegate.gameFieldParams;
            return [
                Math.round(this.canvas.width / fieldParams.dim),
                Math.round(this.canvas.height / fieldParams.dim),
            ];
        }

        /**
         * @param {Object} event
         * @return {GameField}
         */
        setCoordMapper(event) {
            gameBus.on(event, ({x, y}) => {
                const [cellWidth, cellHeight] = this.computeCellParams();

                const j = Math.floor(x / cellWidth);
                const i = Math.floor(y / cellHeight);

                console.log(i, j);
                gameBus.emit(gameEvents.REQUEST_SETUP_PERMISSION, {i, j});
            });
            return this;
        }

        /**
         * @param {Number} playersCount
         */
        init(playersCount = 2) {
            if (!playersCount) return;

            this._calcDelegate.playersCount = playersCount;
            const fieldParams = this._calcDelegate.gameFieldParams;

            const [cellWidth, cellHeight] = this.computeCellParams();

            this._scene.clear();

            const ctx = this.ctx;
            for (let i = 0; i < fieldParams.dim; i++) {
                for (let j = 0; j < fieldParams.dim; j++) {
                    const cell = new Cell(ctx, {width: cellWidth, height: cellHeight});
                    cell.x = i * cellWidth + Math.round(cellWidth / 2);
                    cell.y = j * cellHeight + Math.round(cellHeight / 2);

                    this._scene.addFigure(cell);
                }
            }
            this._scene.render();
        }
    };
});
