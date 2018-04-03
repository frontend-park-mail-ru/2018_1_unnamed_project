'use strict';

// noinspection JSUnusedLocalSymbols
define('Page/access', (require) => {
    /**
     * Типы доступа польхователей к странице (т.к. могет быть ограничения
     * не только залогинен/незалогинен).
     */
    return {
        ANY_USER: 'any_user',
        LOGGED_IN_USER: 'logged_in_user',
        NOT_LOGGED_IN_USER: 'not_logged_in_user',
    };
});
