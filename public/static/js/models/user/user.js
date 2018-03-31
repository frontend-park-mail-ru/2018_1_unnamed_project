'use strict';

define('User', (require) => {
    const API = require('API');
    const RouterEvents = require('Router/events');

    const bus = require('bus');
    const events = require('User/events');

    let currentUser = null;

    const api = new API();

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
            this.avatarLink = data.avatarLink;
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

        static signIn(credentials) {
            api
                .signIn(credentials)
                .then((response) => {
                    // noinspection ReuseOfLocalVariableJS
                    currentUser = new User(response);
                    bus.emit(events.CURRENT_USER_CHANGED, currentUser);
                    bus.emit(RouterEvents.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, null);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        static signUp(credentials) {
            api
                .signUp(credentials)
                .then((response) => {
                    // noinspection ReuseOfLocalVariableJS
                    currentUser = new User(response);
                    bus.emit(events.CURRENT_USER_CHANGED, currentUser);
                    bus.emit(RouterEvents.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, null);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        static update(data) {
            api
                .updateProfile(data)
                .then((response) => {
                    // noinspection ReuseOfLocalVariableJS
                    currentUser = new User(response);
                    bus.emit(events.CURRENT_USER_CHANGED, currentUser);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
});
