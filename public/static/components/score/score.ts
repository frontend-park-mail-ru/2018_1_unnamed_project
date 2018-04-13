import {Component} from "../component";
import scoreTemplate from "./score.pug";

import "./score.css";

export class Score extends Component {
    private _active: boolean;
    private _value;

    /**
     * @param {*} element
     */
    constructor(element) {
        super({element, templateFunction: scoreTemplate});

        this._active = true;

        this.render({score: 'Очков 0'});
    }

    set score(score) {
        if (!this._active) return;
        this._value.innerText = `Очков ${score}`;
    }

    /**
     *
     */
    show() {
        this.element.removeAttribute('hidden');
    }

    /**
     *
     */
    hide() {
        this.element.setAttribute('hidden', 'hidden');
    }

    /**
     * @override
     * @param {Object} attrs
     */
    render(attrs) {
        super.render(attrs);

        this._value = this.element.querySelector('.score__text');
        this.show();

        return this;
    }
}
