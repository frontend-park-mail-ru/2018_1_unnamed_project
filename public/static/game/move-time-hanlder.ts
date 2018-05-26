import {GameEvents} from "./events";
import gameBus from "./game-bus";

export class MoveTimeHandler {
    /**
     * @param {Number} moveTimeCounter
     */
    static renderProgress(moveTimeCounter) {
        gameBus.emit(GameEvents.SetTimeLeft, moveTimeCounter);
    }
}
