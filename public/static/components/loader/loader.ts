import {Component} from '../component';
import {Push} from '../push/push';
import {Root} from '../root/root';
import loaderTemplate from './loader.pug';

import './loader.scss';

export class Loader extends Component {
    private static _Instance: Loader;

    private _root: Root;
    private _push: Push;

    constructor({element = null} = {}) {
        if (Loader._Instance) {
            return Loader._Instance;
        }

        super({element, templateFunction: loaderTemplate});

        this._push = new Push();
        this._root = new Root();
        this
            .render(this.attrs)
            .hide();

        Loader._Instance = this;
    }

    /**
     * @override
     * @returns {Loader}
     */
    hide(): this {
        this._push.show();
        this._root.show();
        return super.hide();
    }

    /**
     * @override
     * @returns {Loader}
     */
    show(): this {
        this._push.hide();
        this._root.hide();
        return super.show();
    }
}
