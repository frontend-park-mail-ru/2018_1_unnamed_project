'use strict';

define('Form', (require) => {
    const Component = require('Component');

    const bus = require('bus');

    const events = require('Form/events');

    return class Form extends Component {
        /**
         * @param {Object} element Элемент, в котором рендерить.
         * @param {Object} attrs   Параметры отрисовки.
         */
        constructor({element, attrs = {}}) {
            super({element, templateFunction: formTemplate, attrs});

            this._form = null;
            this.init();
        }

        /**
         * @private
         */
        init() {
            this._form = this._form || this.element.querySelector('.js-form');

            this._form.addEventListener('submit', (evt) => {
                evt.preventDefault();

                const data = {};
                let errors = null;

                this.attrs.fields.forEach((field) => {
                    const name = field.name;
                    const value = this._form.elements[name].value;

                    if (field.validator.validate(value)) {
                        data[name] = value;
                    } else {
                        (errors || (errors = [])).push(field.validator.lastError);
                    }
                });

                bus.emit(events.FORM_DATA_SUBMITTED, {data, errors});
            });
        }
    };
});
