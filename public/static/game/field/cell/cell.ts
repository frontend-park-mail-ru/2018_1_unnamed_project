import {Rectangle} from '../../graphics/rectangle';
import {CellStatus} from './status';
import {StatusMapper} from './status-mapper';

export class Cell extends Rectangle {
    private _status: CellStatus;
    private _colors;
    private _enabled: boolean;

    /**
     * @param {Object} ctx
     * @param {Number} width
     * @param {Number} height
     */
    constructor(ctx, {width = 0, height = 0} = {}) {
        super(ctx, {width, height});
        this._enabled = true;
        this.changeStatus(CellStatus.Empty);
    }

    public get status() {
        return this._status;
    }

    public set enabled(enabled: boolean) {
        this._enabled = enabled;
        this.changeStatus();
    }

    /**
     * @private
     * @param {Number} status
     * @return {Cell}
     */
    changeStatus(status = null) {
        if (status === CellStatus.Hovered) {
            return this.hover();
        }

        if (status !== null) {
            this._status = status;
            this._colors = StatusMapper.mapStatus(status);
        }

        const {borderColor, fillColor} = (this._enabled) ? this._colors.enabled : this._colors.disabled;
        this.borderColor = borderColor || this.borderColor;
        this.fillColor = fillColor || this.fillColor;

        return this;
    }

    /**
     * Builds status from existing cell
     * @param status
     */
    setStatusFromExisting(status: CellStatus) {
        this._status = status;
        this._colors = StatusMapper.mapStatus(status);
        this.changeStatus();
    }

    private hover() {
        if (!this._enabled) return;

        const hoverColors = StatusMapper.mapHover(this._status);

        if (!hoverColors) return;

        const {borderColor, fillColor} = hoverColors.enabled;
        this.borderColor = borderColor || this.borderColor;
        this.fillColor = fillColor || this.fillColor;

        return this;
    }
}
