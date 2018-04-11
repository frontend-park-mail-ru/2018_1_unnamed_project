import {Rectangle} from "../../graphics/rectangle";
import {CellStatus} from "./status";
import {StatusMapper} from "./status-mapper";

export class Cell extends Rectangle {
    public status;
    
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

    /**
     * @private
     * @param {Number} status
     * @return {Cell}
     */
    changeStatus(status = null) {
        if (status !== null) {
            this.status = StatusMapper.mapStatus(status);
        }

        const colors = (this._enabled) ? this.status.enabled : this.status.disabled;
        this.borderColor = colors.borderColor;
        this.fillColor = colors.fillColor;

        return this;
    }
}
