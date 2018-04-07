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

            this._cells = [];

            this._scene = new Scene(ctx);
            this._calcDelegate = new CalcDelegate();

            this.setCoordMapper(gameEvents.LCLICK)
                .setCoordMapper(gameEvents.RCLICK)
                .setDrawHandler()
                .setEnableSceneHandler()
                .setDisableSceneHandler();

            this.init();
        }

        /**
         * @return {*[]}
         */
        computeCellParams() {
            return [
                Math.round(this.canvas.width / this._fieldParams.dim),
                Math.round(this.canvas.height / this._fieldParams.dim),
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
         * Хендлер на событие перерисовки.
         * @return {GameField}
         */
        setDrawHandler() {
            gameBus.on(gameEvents.DRAW, ({i, j, status}) => {
                // Поле квадратное, id идут друг за другом,
                // поэтому по i, j можно найти id фигуры.
                const idx = i * this._fieldParams.dim + j;
                const cell = this._cells[idx];
                cell.changeStatus(status);

                this.renderScene();
            });
            return this;
        }

        /**
         * Хендлер события "сделать сцену активной".
         * @return {GameField}
         */
        setEnableSceneHandler() {
            gameBus.on(gameEvents.ENABLE_SCENE, () => this._scene.figures.forEach((figure) => {
                figure.enabled = true;
            }));
            return this;
        }

        /**
         * Хендлер события "сделать сцену неактивной".
         * @return {GameField}
         */
        setDisableSceneHandler() {
            gameBus.on(gameEvents.DISABLE_SCENE, () => this._scene.figures.forEach((figure) => {
                figure.enabled = false;
            }));
            return this;
        }

        /**
         * @param {Number} playersCount
         * @return {GameField}
         */
        init(playersCount = 2) {
            if (!playersCount) return this;

            this._calcDelegate.playersCount = playersCount;
            this._fieldParams = this._calcDelegate.gameFieldParams;

            const [cellWidth, cellHeight] = this.computeCellParams();

            this._cells = [];

            const ctx = this.ctx;
            for (let i = 0; i < this._fieldParams.dim; i++) {
                for (let j = 0; j < this._fieldParams.dim; j++) {
                    const cell = new Cell(ctx, {width: cellWidth, height: cellHeight});
                    cell.x = i * cellWidth + Math.round(cellWidth / 2);
                    cell.y = j * cellHeight + Math.round(cellHeight / 2);

                    this._cells.push(cell);
                }
            }

            return this.renderScene();
        }

        /**
         * @private
         * @return {GameField}
         */
        renderScene() {
            this._scene.removeAll();

            for (let i = 0; i < this._cells.length; i++) {
                this._scene.addFigure(this._cells[i]);
            }

            this._scene.render();

            return this;
        }
    };
});
