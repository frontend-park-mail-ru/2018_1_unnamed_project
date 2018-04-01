'use strict';

define('User', (require) => {
    const API = require('API');
    const LocalStorageProxy = require('LocalStorageProxy');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const RouterEvents = require('Router/events');

    const bus = require('bus');
    const events = require('User/events');

    const api = new API();

    const DEFAULT_AVATAR_LINK = 'https://cdn.weasyl.com/static/media/61/c0/6f/61c06fe056b415366fc32ed9914058a30098ba0264ffed0b9e1108610bd4f2f1.png';

    function renderErrors(errors) {
        const push = new Push();

        errors.forEach((err) => {
            push.addMessage(err);
            console.log(err);
        });

        push.render({level: PushLevels.MSG_ERROR});
    }

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
            this.checkCurrentUser();
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
                .catch((errors) => {
                    LocalStorageProxy.remove('currentUser');
                    console.log(errors);
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
                    bus.emit(events.AUTHENTICATION_DONE, user);
                    bus.emit(RouterEvents.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, null);
                })
                .catch((errors) => {
                    renderErrors(errors);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                });
        }

        static signUp(credentials) {
            api
                .signUp(credentials)
                .then((response) => {
                    const user = new User(response);

                    LocalStorageProxy.save('currentUser', user);

                    bus.emit(events.CURRENT_USER_CHANGED, user);
                    bus.emit(events.AUTHENTICATION_DONE, user);
                    bus.emit(RouterEvents.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, null);
                })
                .catch((errors) => {
                    renderErrors(errors);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, null);
                });
        }

        static update(data) {
            api
                .updateProfile(data)
                .then((response) => {
                    const push = new Push();
                    push.addMessage('Настройки обновлены');
                    push.render({level: PushLevels.MSG_INFO});

                    const user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                })
                .catch((errors) => {
                    renderErrors(errors);
                });
        }

        static changeAvatar(form) {
            api
                .changeAvatar(form)
                .then((response) => {
                    const push = new Push();
                    push.addMessage('Аватар обновлен');
                    push.render({level: PushLevels.MSG_INFO});

                    const user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                })
                .catch((errors) => {
                    renderErrors(errors);
                });
        }

        static deleteAvatar() {
            api
                .deleteAvatar()
                .then((response) => {
                    const push = new Push();
                    push.addMessage('Аватар пользователя удален');
                    push.render({level: PushLevels.MSG_ERROR});

                    const user = new User(response);
                    LocalStorageProxy.save('currentUser', user);
                    bus.emit(events.CURRENT_USER_CHANGED, user);
                })
                .catch((errors) => {
                    console.log(errors);
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
                .catch((errors) => {
                    console.log(errors);
                });
        }
    };
});
