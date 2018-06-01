import {Component} from '../component';
import {Loader} from "../loader/loader";
import formTemplate from './form.pug';

import './form.scss';

export class Form extends Component {
    private readonly _callback;
    private _form;

    /**
     * @param {Object} element Элемент, в котором рендерить.
     * @param {Object} callback Коллбек.
     * @param {Object} attrs   Параметры отрисовки.
     */
    constructor({element, callback, attrs = {}}) {
        super({element, templateFunction: formTemplate, attrs});

        this._callback = callback;
        this._form = null;
        this.init();
    }

    /**
     * @private
     */
    init() {
        this._form = this.element.querySelector('.js-form');

        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();

            const loader = new Loader();
            loader.show();

            const data = {};
            let errors = null;

            this.attrs.fields.forEach((field) => {
                const name = field.name;
                const value = this._form.elements[name].value;

                if (field.validator.validate(value)) {
                    data[name] = value;
                } else {
                    (errors || (errors = [])).push(`${name}: ${field.validator.lastError}`);
                }
            });

            this._callback({data, errors});
        });
    }
}
