import {FloatingPush} from '../components/floating-push/floating-push';
import {CellStatus} from './field/cell/status';

export type GameFieldData = CellStatus[][];

export class Core {
    protected push: FloatingPush;

    constructor() {
        this.push = new FloatingPush();
    }

    /**
     * @abstract
     */
    start(username: string, gameField: GameFieldData, playersCount: number) {
        throw new Error('This method must be overridden');
    }
}
