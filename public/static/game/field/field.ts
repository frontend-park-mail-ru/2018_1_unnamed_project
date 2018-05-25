import {GameEvents} from "../events";
import gameBus from "../game-bus";
import {Scene} from "../graphics/scene";
import {CalcDelegate} from "./calc-delegate";
import {Cell} from "./cell/cell";
import {CellStatus} from "./cell/status";
import {SetupValidator} from "./setup-validator";

export class GameField {
    public gameStarted;
    protected canvas;
    protected ctx;
    protected setupValidator;
    private _calcDelegate: CalcDelegate;
    private _cells: Cell[];
    private _enabled: boolean;
    private _fieldParams;
    private _lastHoveredCellCoords;
    private _scene;

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

        this.setCoordMapper(GameEvents.LClick)
            .setCoordMapper(GameEvents.RClick)
            .setCoordMapper(GameEvents.Hover)
            .setDrawHandler()
            .setUnhoverHandler()
            .setEnableSceneHandler()
            .setDisableSceneHandler();

        this.init(playersCount);
    }

    /**
     * @return {*[]}
     */
    computeCellParams() {
        return [
            Math.floor(this.canvas.width * .99 / this._fieldParams.dim),
            Math.floor(this.canvas.height * .99 / this._fieldParams.dim),
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

            if (i >= this._fieldParams.dim || j >= this._fieldParams.dim) return;

            switch (event) {
                case GameEvents.LClick:
                    if (this.gameStarted) {
                        gameBus.emit(GameEvents.RequestGamePermission, {i, j});
                    } else {
                        gameBus.emit(GameEvents.RequestSetupPermission, {i, j});
                    }
                    break;
                case GameEvents.RClick:
                    if (!this.gameStarted) {
                        gameBus.emit(GameEvents.RequestFreePermission, {i, j});
                    }
                    break;
                case GameEvents.Hover:
                    if (this._lastHoveredCellCoords) {
                        gameBus.emit(GameEvents.Unhover);
                    }

                    this._lastHoveredCellCoords = {i, j};
                    gameBus.emit(GameEvents.Draw, {i, j, status: CellStatus.Hovered});
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
        gameBus.on(GameEvents.Draw, ({i, j, status}) => {
            // Поле квадратное, id идут друг за другом,
            // поэтому по i, j можно найти id фигуры.
            const idx = j * this._fieldParams.dim + i;
            const cell = this._cells[idx];

            if (!cell) return;

            cell.changeStatus(status);
            this.renderScene();
        });
        return this;
    }

    setUnhoverHandler() {
        gameBus.on(GameEvents.Unhover, () => {
            if (!this._lastHoveredCellCoords) return;

            const {i, j} = this._lastHoveredCellCoords;
            const idx = j * this._fieldParams.dim + i;
            const cell = this._cells[idx];

            if (!cell) return;

            cell.changeStatus();
            this.renderScene();
        });
        return this;
    }

    /**
     * Хендлер события "сделать сцену активной".
     * @return {GameField}
     */
    setEnableSceneHandler() {
        gameBus.on(GameEvents.EnableScene, () => {
            this.changeEnabledStatus(true);
        });
        return this;
    }

    /**
     * Хендлер события "сделать сцену неактивной".
     * @return {GameField}
     */
    setDisableSceneHandler() {
        gameBus.on(GameEvents.DisableScene, () => {
            this.changeEnabledStatus(false);
        });
        return this;
    }

    /**
     * @param {number} playersCount
     * @param {boolean} rebuild
     * @returns {GameField}
     */
    init(playersCount = null, rebuild = false) {
        if (playersCount) {
            this._calcDelegate.playersCount = playersCount;
            this._fieldParams = this._calcDelegate.gameFieldParams;
        }

        gameBus.emit(GameEvents.CreateBattlefield, this._fieldParams.dim);

        const [cellWidth, cellHeight] = this.computeCellParams();

        const oldCells = this._cells.slice();
        this._cells = [];

        const ctx = this.ctx;
        for (let i = 0; i < this._fieldParams.dim; i++) {
            for (let j = 0; j < this._fieldParams.dim; j++) {
                const cell = new Cell(ctx, {
                    width: cellWidth,
                    height: cellHeight,
                });
                cell.x = i * cellWidth + Math.round(cellWidth / 2);
                cell.y = j * cellHeight + Math.round(cellHeight / 2);

                if (rebuild) {
                    cell.setStatusFromExisting(oldCells[i * this._fieldParams.dim + j].status);
                }

                this._cells.push(cell);
            }
        }

        return this.renderScene();
    }

    /**
     * @private
     * @return {GameField}
     */
    private renderScene(): GameField {
        this._scene.removeAll();

        for (const cell of this._cells) {
            this._scene.addFigure(cell);
        }

        this._scene.render();

        return this;
    }

    private changeEnabledStatus(enabled: boolean): GameField {
        this._enabled = enabled;

        for (const cell of this._cells) {
            cell.enabled = enabled;
        }

        return this.renderScene();
    }
}
