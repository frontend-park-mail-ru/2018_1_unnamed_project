'use strict';

// noinspection JSUnusedLocalSymbols
define('User', (require) => {
    let currentUser = null;

    /**
     * Модель пользователя.
     */
    return class User {
        /**
         * @param {Object} data
         */
        constructor(data) {
            this.username = data.username;
            this.email = data.email;
            this.rank = data.rank;
        }

        /**
         * @return {boolean}
         */
        static isAuthorized() {
            return !!currentUser;
        }

        /**
         * @return {User|*}
         */
        static get currentUser() {
            return currentUser;
        }
    };
});
