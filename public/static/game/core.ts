import {Push} from "../components/push/push";
import {CellStatus} from "./field/cell/status";

export type GameFieldData = CellStatus[][];

export class Core {
    protected push: Push;

    constructor() {
        this.push = new Push();
    }

    /**
     * @abstract
     */
    start(username: string, gameField: GameFieldData, playersCount: number) {
        throw new Error('This method must be overridden');
    }
}
