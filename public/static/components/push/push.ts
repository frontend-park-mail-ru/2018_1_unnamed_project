import {MessageContainer} from "../message-container";
import pushTemplate from './push.pug';

import './push.scss';

export class Push extends MessageContainer {
    private static _Instance: Push;

    constructor(rootSelector = null) {
        if (Push._Instance) {
            return Push._Instance;
        }

        super({
            attrs: {},
            element: document.querySelector(rootSelector),
            templateFunction: pushTemplate,
        });

        Push._Instance = this;
    }
}
