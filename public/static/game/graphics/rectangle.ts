import {Figure} from "./figure";

export class Rectangle extends Figure {
    protected width;
    protected height;
    protected borderColor;
    protected fillColor;

    /**
     * @param {Object} ctx Контекст canvas.
     * @param {Number} width
     * @param {Number} height
     * @param {string} borderColor
     * @param {string} fillColor
     */
    constructor(ctx, {width = 0, height = 0, borderColor = 'black', fillColor = 'white'} = {}) {
        super(ctx);

        this.width = width;
        this.height = height;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
    }

    /**
     * @override
     * @protected
     */
    setup() {
        const ctx = this.ctx;

        ctx.translate(this.x, this.y);
        ctx.strokeStyle = this.borderColor;
        ctx.fillStyle = this.fillColor;
    }

    /**
     * @override
     * @protected
     */
    draw() {
        const ctx = this.ctx;

        const [x, y, width, height] = [-this.width / 2, -this.height / 2, this.width, this.height];
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }
}
