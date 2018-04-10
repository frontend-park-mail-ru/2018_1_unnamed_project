'use strict';

define('game/field/GameField', (require) => {
    const CalcDelegate = require('game/field/CalcDelegate');
    const Cell = require('game/field/cell/Cell');
    const Scene = require('graphics/Scene');
    const SetupValidator = require('game/field/SetupValidator');
    const gameBus = require('game/core/bus');
    const gameEvents = require('game/core/events');

    /**
     * Игровое поле.
     */
    return class GameField {
        /**
         * @param {*} canvas
         * @param {int} playersCount
         */
        constructor(canvas, playersCount = 2) {
            this.canvas = canvas;
            // noinspection JSUnusedGlobalSymbols
            this.setupValidator = new SetupValidator();
            const ctx = canvas.getContext('2d');
            this.ctx = ctx;

            this.gameStarted = false;
            this._enabled = true;

            this._cells = [];

            this._scene = new Scene(ctx);
            this._calcDelegate = new CalcDelegate();

            this.setCoordMapper(gameEvents.LCLICK)
                .setCoordMapper(gameEvents.RCLICK)
                .setDrawHandler()
                .setEnableSceneHandler()
                .setDisableSceneHandler();

            this.init(playersCount);
        }

        /**
         * @return {*[]}
         */
        computeCellParams() {
            return [
                Math.round(this.canvas.width * .99 / this._fieldParams.dim),
                Math.round(this.canvas.height * .99 / this._fieldParams.dim),
            ];
        }

        /**
         * @param {Object} event
         * @return {GameField}
         */
        setCoordMapper(event) {
            gameBus.on(event, ({x, y}) => {
                if (!this._enabled) return;

                const [cellWidth, cellHeight] = this.computeCellParams();

                const j = Math.floor(x / cellWidth);
                const i = Math.floor(y / cellHeight);

                console.log(i, j);
                switch (event) {
                case gameEvents.LCLICK:
                    if (this.gameStarted) {
                        gameBus.emit(gameEvents.REQUEST_SETUP_PERMISSION, {i, j});
                    } else {
                        gameBus.emit(gameEvents.REQUEST_GAME_PERMISSION, {i, j});
                    }
                    break;
                case gameEvents.RCLICK:
                    if (this.gameStarted) {
                        gameBus.emit(gameEvents.REQUEST_FREE_PERMISSION, {i, j});
                    }
                    break;
                default:
                    break;
                }
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
                const idx = j * this._fieldParams.dim + i;
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
            gameBus.on(gameEvents.ENABLE_SCENE, () => {
                this._enabled = true;
                this._scene.figures.forEach((figure) => {
                    figure.enabled = true;
                });
                this.renderScene();
            });
            return this;
        }

        /**
         * Хендлер события "сделать сцену неактивной".
         * @return {GameField}
         */
        setDisableSceneHandler() {
            gameBus.on(gameEvents.DISABLE_SCENE, () => {
                this._enabled = false;
                this._scene.figures.forEach((figure) => {
                    figure.enabled = false;
                });
                this.renderScene();
            });
            return this;
        }

        /**
         * @param {Number} playersCount
         * @return {GameField}
         */
        init(playersCount = null) {
            if (playersCount) {
                this._calcDelegate.playersCount = playersCount;
                this._fieldParams = this._calcDelegate.gameFieldParams;
            }

            gameBus.emit(gameEvents.CREATE_BATTLEFIELD, this._fieldParams.dim);

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
