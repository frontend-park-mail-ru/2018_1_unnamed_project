'use strict';

define('LocalStorageProxy', (require) => {
    return class LocalStorageProxy {
        static save(key, value) {
            window.localStorage[key] = JSON.stringify(value);
        }

        static fetch(key) {
            const value = window.localStorage[key];
            return value ? JSON.parse(value) : null;
        }

        static remove(key) {
            window.localStorage.removeItem(key);
        }
    };
});
