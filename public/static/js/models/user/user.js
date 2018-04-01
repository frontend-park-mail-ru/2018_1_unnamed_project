'use strict';

define('User', (require) => {
    const API = require('API');
    const LocalStorageProxy = require('LocalStorageProxy');
    const RouterEvents = require('Router/events');

    const bus = require('bus');
    const events = require('User/events');

    const api = new API();

    const DEFAULT_AVATAR_LINK = 'https://www.shareicon.net/messages/128x128/2016/08/05/806962_user_512x512.png';

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
            this.avatarLink = (data.avatarLink) ?
                (api.backendURI + data.avatarLink) : DEFAULT_AVATAR_LINK;
            this.uploadAvatarLink = `${api.backendURI}/me/avatar`;
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
                    const user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                })
                .catch((err) => {
                    LocalStorageProxy.remove('currentUser');
                    console.log(err);
                    bus.emit(events.CURRENT_USER_CHANGED, null);
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
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                });
        }

        static signUp(credentials) {
            api
                .signUp(credentials)
                .then((response) => {
                    // noinspection ReuseOfLocalVariableJS
                    user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                    bus.emit(RouterEvents.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, null);
                })
                .catch((err) => {
                    console.log(err);
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                });
        }

        static update(data) {
            api
                .updateProfile(data)
                .then((response) => {
                    user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                })
                .catch((err) => {
                    console.log(err);
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                });
        }

        static logout() {
            api
                .logout()
                .then((response) => {
                    LocalStorageProxy.remove('currentUser');
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                    bus.emit(RouterEvents.NAVIGATE_TO_PAGE, '/');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
});
