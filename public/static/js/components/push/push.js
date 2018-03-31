'use strict';

define('Push', (require) => {
    const Component = require('Component');

    const levels = require('Push/levels');

    return class Push extends Component {
        /**
         * @param {Object}   element Элемент, в котором рендерить.
         * @param {Object}   attrs   Параметры отрисовки.
         */
        constructor() {
            if (Push.__instance) {
                return Push.__instance;
            }

            super({
                element: document.querySelector('.msg'),
                templateFunction: pushTemplate,
                attrs: {},
            });

            this._data = [];

            Push.__instance = this;
        }

        /**
         * @return {Array|*}
         */
        get data() {
            return this._data;
        }

        /**
         * @param {Array|*} messages
         */
        set data(messages) {
            this._data = messages;
        }

        /**
         * Добавляет сообщение
         * @param {string} message
         * @return {Push}
         */
        addMessage(message) {
            this._data.push(message);
            return this;
        }

        /**
         * Очищает содержимое и сообщения.
         * @override
         */
        clear() {
            super.clear();
            this._data = [];
            return this;
        }

        /**
         * @override
         * @param {Object} level
         * @return {Push}
         */
        render({level = levels.MSG_INFO}) {
            if (!this._data) return this;

            super.render({
                level,
                messages: this._data,
            });
            this._data = [];

            return this;
        }
    };
});
