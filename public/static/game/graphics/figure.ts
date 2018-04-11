export class Figure {
    public x: number;
    public y: number;
    protected ctx;

    /**
     * @param {Object} ctx Контекст canvas.
     */
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 0;
        this.y = 0;
    }

    /**
     * Отрисовывает фигуру.
     * @return {Figure}
     */
    render() {
        this.ctx.save();

        this.setup();
        this.draw();

        this.ctx.restore();

        return this;
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @protected
     */
    setup() {
        throw new Error('This method must be implemented');
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @abstract
     * @protected
     */
    draw() {
        throw new Error('This method must be implemented');
    }
}
