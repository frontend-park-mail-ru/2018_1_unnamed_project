'use strict';

define('User', (require) => {
    const API = require('API');
    const LocalStorageProxy = require('LocalStorageProxy');
    const RouterEvents = require('Router/events');

    const bus = require('bus');
    const events = require('User/events');

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
            return !!this.currentUser;
        }

        /**
         * @return {User|*}
         */
        static get currentUser() {
            return LocalStorageProxy.fetch('currentUser');
        }

        static checkCurrentUser() {
            api
                .getMe()
                .then((response) => {
                    LocalStorageProxy.save('currentUser', new User(response));
                })
                .catch((err) => {
                    LocalStorageProxy.remove('currentUser');
                    console.log(err);
                });
        }

        static signIn(credentials) {
            api
                .signIn(credentials)
                .then((response) => {
                    const user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
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
                    user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
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
                    user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, currentUser);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
});
