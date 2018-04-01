'use strict';

define('Push', (require) => {
    const Component = require('Component');

    const levels = require('Push/levels');

    return class Push extends Component {
        /**
         *
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

            // Сообщения, доступные только текущей странице.
            this._messages = new Set();
            // Сообщения, которые должны отобразиться на следующей странице.
            this._sharedMessages = new Set();

            Push.__instance = this;
        }

        /**
         * @return {Array|*}
         */
        get messages() {
            return this._messages;
        }

        /**
         * @param {Array|*} messages
         */
        set messages(messages) {
            this._messages = messages;
        }

        /**
         * Добавляет сообщение
         * @param {string} message
         * @return {Push}
         */
        addMessage(message) {
            this._messages.add(message);
            return this;
        }

        addSharedMessage(message) {
            this._sharedMessages.add(message);
        }

        clearMessages() {
            this._messages.clear();
            return this;
        }

        clearSharedMessages() {
            this._sharedMessages.clear();
            return this;
        }

        /**
         * Очищает содержимое и сообщения.
         * @override
         */
        clear() {
            super.clear();
            this._messages.clear();
            return this;
        }

        /**
         * @override
         * @param {Object} level
         * @return {Push}
         */
        render({level = levels.MSG_INFO}) {
            if (this._messages.em) return this;

            super.render({
                level,
                messages: [...this._messages],
            });
            this.clearMessages();

            return this;
        }

        renderShared({level = levels.MSG_INFO}) {
            if (this._sharedMessages.empty) return this;

            super.render({
                level,
                messages: [...this._sharedMessages],
            });
            this.clearSharedMessages();

            return this;
        }
    };
});
