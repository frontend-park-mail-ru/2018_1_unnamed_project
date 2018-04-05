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

    /**
     * Вспомогатльная функция для отрисовки ошибок.
     * @param {Array} errors
     */
    function renderErrors(errors) {
        const push = new Push();

        errors.forEach((err) => {
            push.addMessage(err);
            console.log(err);
        });

        push.render({level: PushLevels.MSG_ERROR});
    }

    /**
     * Вспомогательная функция для рендеринга приветственного сообщения.
     * @param {string} username
     */
    function renderHello(username) {
        const push = new Push();
        push.addSharedMessage(`Добро пожаловать, ${username}`);
    }

    /**
     * Модель пользователя.
     * @note Текущий пользователь сохраняется в LocalStorage.
     */
    return class User {
        /**
         * @param {Object} data
         */
        constructor(data) {
            this.username = data.username;
            this.email = data.email;
            this.rank = data.rank;
            this.avatarLink = this.resolveAvatarLink(data.avatarLink);
            // for demo
            // this.avatarLink = (data.avatarLink) ?
            // (data.avatarLink) : DEFAULT_AVATAR_LINK;
            this.uploadAvatarLink = `${api.backendURI}/me/avatar`;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Разрешает полный путь к аватарке.
         * @note ХАРДКОД!
         * @private
         * @param {string} avatarLink
         * @return {*}
         */
        resolveAvatarLink(avatarLink) {
            switch (true) {
            case !avatarLink:
                return DEFAULT_AVATAR_LINK;
            // Если не начинается с uploads, то картинка должна быть получена с другого ресурса
            // и добавлять префикс бекенда не надо.
            case !avatarLink.startsWith('/uploads'):
                return avatarLink;
            default:
                return api.backendURI + avatarLink;
            }
        }

        /**
         * @return {boolean}
         */
        static isAuthorized() {
            return !! LocalStorageProxy.fetchRaw('currentUser');
        }

        /**
         * @return {User|*}
         */
        static get currentUser() {
            return LocalStorageProxy.fetch('currentUser');
        }

        /**
         * Проверяет авторизацию пользователя.
         */
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

        /**
         * Авторизует пользователя.
         * @param {*} credentials
         */
        static signIn(credentials) {
            api
                .signIn(credentials)
                .then((response) => {
                    const user = new User(response);

                    LocalStorageProxy.save('currentUser', user);

                    renderHello(user.username);

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

        /**
         * Создает пользователя.
         * @param {*} credentials
         */
        static signUp(credentials) {
            api
                .signUp(credentials)
                .then((response) => {
                    const user = new User(response);

                    LocalStorageProxy.save('currentUser', user);

                    renderHello(user.username);

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

        /**
         * Обновляет данные пользователя.
         * @param {*} data
         */
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

        /**
         * Изменяет аватар пользователя.
         * @param {*} form
         */
        static changeAvatar(form) {
            api
                .uploadAvatar(form)
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

        /**
         * Удаляет аватар пользователя.
         */
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

        /**
         * Осуществляет выход пользователя.
         */
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
