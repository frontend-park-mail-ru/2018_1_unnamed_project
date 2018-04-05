'use strict';

// noinspection JSUnusedLocalSymbols
define('EventBus', (require) => {
    /**
     * Шина сообщений.
     */
    return class EventBus {
        /**
         *
         */
        constructor() {
            this._listeners = {};
        }

        /**
         * Добавляет обработчик события.
         * @param {string}   event
         * @param {function} listener
         * @return {EventBus}
         */
        on(event, listener) {
            (this._listeners[event] || (this._listeners[event] = [])).push(listener);
            return this;
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Удаляет обработчик события.
         * @param {string}   event
         * @param {function} listener
         * @return {EventBus}
         */
        off(event, listener) {
            if (listener) {
                this._listeners[event] = (this._listeners || []).filter((l) => l !== listener);
            } else {
                this._listeners[event] = [];
            }

            return this;
        }

        /**
         * Инициирует событие.
         * @param {string} event
         * @param {Object} data
         * @return {EventBus}
         */
        emit(event, data) {
            (this._listeners[event] || (this._listeners[event] = [])).forEach((l) => l(data));
            return this;
        }
    };
});
