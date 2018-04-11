import {Push, PushLevels} from "../components/push/push";

const GREEN_TIME_ZONE = 10;
const YELLOW_TIME_ZONE = 5;
const RED_TIME_ZONE = 0;

export class MoveTimeHandler {
    private _push;

    /**
     *
     */
    constructor() {
        this._push = new Push();
    }

    /**
     * @param {Number} moveTimeCounter
     */
    renderProgress(moveTimeCounter) {
        this._push.addMessage(`Осталось секунд: ${moveTimeCounter}`);

        // Отрисовка сообщения разными цветами, чтобы подогнать пользователя.
        let level = null;
        switch (true) {
            case moveTimeCounter > GREEN_TIME_ZONE:
                level = PushLevels.Success;
                break;
            case moveTimeCounter > YELLOW_TIME_ZONE:
                level = PushLevels.Warning;
                break;
            case moveTimeCounter > RED_TIME_ZONE:
                level = PushLevels.Error;
                break;
            default:
                level = PushLevels.Success;
        }

        this._push.render({level});
    }
}
