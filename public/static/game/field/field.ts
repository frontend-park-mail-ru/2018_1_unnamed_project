import {GameEvents} from "../events";
import gameBus from "../game-bus";
import {Scene} from "../graphics/scene";
import {CalcDelegate} from "./calc-delegate";
import {Cell} from "./cell/cell";
import {SetupValidator} from "./setup-validator";

export class GameField {
    public gameStarted;
    protected canvas;
    protected ctx;
    protected setupValidator;
    private _calcDelegate: CalcDelegate;
    private _cells;
    private _enabled: boolean;
    private _fieldParams;
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
        gameBus.on(GameEvents.EnableScene, () => {
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
        gameBus.on(GameEvents.DisableScene, () => {
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
        
        gameBus.emit(GameEvents.CreateBattlefield, this._fieldParams.dim);
        
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
        
        for (const cell of this._cells) {
            this._scene.addFigure(cell);
        }
        
        this._scene.render();
        
        return this;
    }
}
