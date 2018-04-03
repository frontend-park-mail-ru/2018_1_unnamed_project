'use strict';

define('LocalStorageProxy', (require) => {
    /**
     * Объект для работы с LocalStorage.
     */
    return class LocalStorageProxy {
        /**
         * Сохраняет значение по ключу.
         * @param {string} key
         * @param {*} value
         */
        static save(key, value) {
            window.localStorage[key] = JSON.stringify(value);
        }

        /**
         * Извлекает значение по ключу.
         * @param {string} key
         * @return {*|null}
         */
        static fetch(key) {
            const value = window.localStorage[key];
            return value ? JSON.parse(value) : null;
        }

        /**
         * Удаляет значение по ключу.
         * @param {string} key
         */
        static remove(key) {
            window.localStorage.removeItem(key);
        }
    };
});
