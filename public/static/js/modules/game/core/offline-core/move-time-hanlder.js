'use strict';

define('game/core/MoveTimeHandler', (require) => {
    const Push = require('Push');
    const PushLevels = require('Push/levels');

    const GREEN_TIME_ZONE = 10;
    const YELLOW_TIME_ZONE = 5;
    const RED_TIME_ZONE = 0;

    return class MoveTimeHandler {
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
                level = PushLevels.MSG_SUCCESS;
                break;
            case moveTimeCounter > YELLOW_TIME_ZONE:
                level = PushLevels.MSG_WARNING;
                break;
            case moveTimeCounter > RED_TIME_ZONE:
                level = PushLevels.MSG_ERROR;
                break;
            default:
                level = PushLevels.MSG_SUCCESS;
            }

            this._push.render({level});
        }
    };
});
