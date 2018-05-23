import rand from "../../utils/rand";
import {CellStatus} from "../field/cell/status";
import {SetupValidator} from "../field/setup-validator";
import gameBus from "../game-bus";

export class GameBot {
    public ships: CellStatus[][];
    public fieldSize: number;
    /**
     * @param {Number} fieldSize
     */
    constructor(fieldSize) {
        this.fieldSize = fieldSize;
    }

    /**
     * @return {Array<string>}
     */
    randomizeShips() {
        this.ships = Array.from(Array(this.fieldSize), () => (new Array(this.fieldSize)).fill(CellStatus.Empty));
        const shipsLimit = SetupValidator.computeShipsLimit(this.fieldSize);

        let shipsCount = 0;

        while (shipsCount !== shipsLimit) {
            const [i, j] = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

            if (this.ships[i][j] !== CellStatus.Empty) {
                continue;
            }

            this.ships[i][j] = CellStatus.Busy;
            shipsCount++;
        }

        console.log(this.ships);
        
        return this.ships;
    }

    /**
     * @note РЕФАКТОРИНГ
     * @return {*[]}
     */
    makeMove() {
        let count = this.fieldSize * this.fieldSize;

        while (true) {
            const [i, j] = [rand(0, this.fieldSize), rand(0, this.fieldSize)];

            if (this.ships[i][j] === CellStatus.Empty) {
                return [i, j];
            }

            if (!--count) {
                console.log('Бот слажал');
                return null;
            }
        }
    }
}
