import {Figure} from "./figure";

export class Scene {
    protected ctx;
    protected figures: Map<number, Figure>;
    private _id: number;

    /**
     * @param {Object} ctx Контекст canvas.
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.figures = new Map();

        this._id = 0;
    }

    /**
     * Добавляет фигуру на сцену (сразу отрисовывает).
     * @param {Figure} figure
     * @return {Number}
     */
    addFigure(figure) {
        const id = this.getNextId();
        this.figures.set(id, figure);
        return id;
    }

    /**
     * @return {Scene}
     */
    render() {
        this.clear();
        this.figures.forEach((figure) => figure.render());
        return this;
    }

    /**
     * @return {Scene}
     */
    clear() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return this;
    }

    /**
     * Полностью очищает сцену.
     * @return {Scene}
     */
    removeAll() {
        this.clear();
        this.figures.clear();
        this._id = 0;
        return this;
    }

    /**
     * Возвращает новый id для фигуры.
     * @private
     * @return {number}
     */
    private getNextId() {
        return this._id++;
    }
}
