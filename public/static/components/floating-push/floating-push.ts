import {MessageContainer} from '../message-container';
import floatingPushTemplate from './floating-push.pug';

import './floating-push.scss';

export class FloatingPush extends MessageContainer {
    private static _Instance: FloatingPush;

    constructor(rootSelector = null) {
        if (FloatingPush._Instance) {
            return FloatingPush._Instance;
        }

        super({
            attrs: {},
            element: document.querySelector(rootSelector),
            templateFunction: floatingPushTemplate,
        });

        FloatingPush._Instance = this;
    }
}
