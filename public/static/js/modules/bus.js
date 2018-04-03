'use strict';

// noinspection JSUnusedLocalSymbols
define('bus', (require) => {
    /**
     * Шина сообщений.
     * @note Возвращает объект!
     */
    return new class Bus {
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
         * @return {Bus}
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
         * @return {Bus}
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
         * @return {Bus}
         */
        emit(event, data) {
            (this._listeners[event] || (this._listeners[event] = [])).forEach((l) => l(data));
            return this;
        }
    };
});
