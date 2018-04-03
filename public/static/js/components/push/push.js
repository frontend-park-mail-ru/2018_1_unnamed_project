'use strict';

define('Push', (require) => {
    const Component = require('Component');

    const levels = require('Push/levels');

    /**
     * Компонент для генерации сообщений пользователю.
     */
    return class Push extends Component {
        /**
         * @note Синглтон.
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
            // Это буфер сообщений, разделяемый между страницами.
            this._sharedMessages = new Set();

            Push.__instance = this;
        }

        /**
         * Возвращает буфер сообщений для текущей страницы.
         * @return {Set|*}
         */
        get messages() {
            return this._messages;
        }

        /**
         * Перезаписывает множество сообщений для текущей страницы.
         * @param {Set|*} messages
         */
        set messages(messages) {
            this._messages = messages;
        }

        /**
         * Добавляет сообщение в буфер текущей страницы.
         * @param {string} message
         * @return {Push}
         */
        addMessage(message) {
            this._messages.add(message);
            return this;
        }

        /**
         * Добавляет сообщение в разделяемый буфер.
         * @param {string} message
         */
        addSharedMessage(message) {
            this._sharedMessages.add(message);
        }

        /**
         * Очищает буфер сообщений для текущей страницы.
         * @return {Push}
         */
        clearMessages() {
            this._messages.clear();
            return this;
        }

        /**
         * Очищает разделяемый буфер сообщений.
         * @return {Push}
         */
        clearSharedMessages() {
            this._sharedMessages.clear();
            return this;
        }

        /**
         * Очищает содержимое компонента и буфер сообщений для текущей страницы.
         * @note Разделяемый буфер надо чистить явно!
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

        /**
         * Отрисовывает компонент с разделяемыми сообщениями.
         * @param {string} level
         * @return {Push}
         */
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
