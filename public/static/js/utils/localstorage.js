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
         * Извлекает значение по ключу и десериализует его из строки.
         * @param {string} key
         * @return {*|null}
         */
        static fetch(key) {
            const value = LocalStorageProxy.fetchRaw(key);
            return value ? JSON.parse(value) : null;
        }

        /**
         * Извлекает значение по ключу.
         * @note Использовать для быстрых операций, где важен только факт наличия/отсутствия ключа.
         * @param {string} key
         * @return {*|null}
         */
        static fetchRaw(key) {
            return window.localStorage[key];
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
