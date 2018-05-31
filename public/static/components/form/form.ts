import {Component} from '../component';
import formTemplate from './form.pug';

import './form.scss';

export enum FormEvents {
    FormDataSubmitted = 'form_data_submitted',
}

export class Form extends Component {
    private readonly _callback;
    private _form;

    /**
     * @param {Object} element Элемент, в котором рендерить.
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
            console.log('1');

            evt.preventDefault();

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
