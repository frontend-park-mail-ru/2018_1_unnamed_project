import rand from "../../utils/rand";
import {CellStatus} from "../field/cell/status";
import {SetupValidator} from "../field/setup-validator";

export class GameBot {
    public fieldSize: number;
    private _prevMoves: Set<number[]>;

    /**
     * @param {Number} fieldSize
     */
    constructor(fieldSize) {
        this.fieldSize = fieldSize;
        this._prevMoves = new Set();
    }

    /**
     * @return {Array<string>}
     */
    randomizeShips() {
        const ships = Array.from(Array(this.fieldSize), () => (new Array(this.fieldSize)).fill(CellStatus.Empty));
        const shipsLimit = SetupValidator.computeShipsLimit(this.fieldSize);

        let shipsCount = 0;

        while (shipsCount !== shipsLimit) {
            const [i, j] = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

            if (ships[i][j] !== CellStatus.Empty) {
                continue;
            }

            ships[i][j] = CellStatus.Busy;
            shipsCount++;
        }

        console.log(ships);
        
        return ships;
    }

    /**
     * @note РЕФАКТОРИНГ!
     * @return {*[]}
     */
    makeMove() {
        let count = this.fieldSize * this.fieldSize;

        while (true) {
            const cell = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

            if (!this._prevMoves.has(cell)) {
                this._prevMoves.add(cell);
                return cell;
            }

            if (!--count) {
                console.log('Бот слажал');
                return null;
            }
        }
    }
}
