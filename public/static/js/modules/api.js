'use strict';

(function() {
    // const BACKEND_URI = 'http://localhost:8080'; // debug
    const BACKEND_URI = 'https://dev-api-shipcollision.herokuapp.com'; // production

    /**
     * Модуль для работы с API.
     */
    class API {
        /**
         *
         */
        constructor() {
            this.httpModule = window.HttpModule;
            // noinspection SpellCheckingInspection
            this.routeMappings = {
                'me': BACKEND_URI + '/me',
                'signIn': BACKEND_URI + '/signin',
                'signUp': BACKEND_URI + '/users',
                'logout': BACKEND_URI + '/signout',
                'scoreboard': BACKEND_URI + '/users/scoreboard',
                'avatar': BACKEND_URI + '/me/avatar',
            };
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает текущий базовый URI бекенда.
         * @return {string}
         */
        get backendURI() {
            return BACKEND_URI;
        }

        /**
         * GET /me
         * @return {*}
         */
        getMe() {
            return this.httpModule.doGet({
                url: this.routeMappings.me,
            });
        }

        /**
         * POST /signin
         * @param {Object} data Данные пользователя.
         * @return {*}
         */
        signIn(data) {
            return this.httpModule.doPost({
                url: this.routeMappings.signIn,
                data,
            });
        }

        /**
         * POST /users
         * @param {Object} data Данные пользователя.
         * @return {*}
         */
        signUp(data) {
            return this.httpModule.doPost({
                url: this.routeMappings.signUp,
                data,
            });
        }

        /**
         * DELETE /signout
         * @return {*}
         */
        logout() {
            return this.httpModule.doDelete({
                url: this.routeMappings.logout,
            });
        }

        /**
         * GET /users/scoreboard
         * @param {string} pagination offset and limit
         * @return {*}
         */
        scoreboard(pagination) {
            return this.httpModule.doGet({
                url: this.routeMappings.scoreboard + pagination,
            });
        }

        /**
         * POST /me/avatar
         * @param {Object} data Файл с картинкой.
         * @return {*}
         */
        uploadAvatar(data) {
            /**
             * Content-Type выставляется в null для того, чтобы
             * браузер сам коректно выставил boundaries для multipart/form-data.
             */
            return this.httpModule.doPost({
                url: this.routeMappings.avatar,
                contentType: null,
                data,
            });
        }

        /**
         * DELETE /me/avatar
         * @return {*}
         */
        deleteAvatar() {
            return this.httpModule.doDelete({
                url: this.routeMappings.avatar,
            });
        }

        /**
         * PATCH /me
         * @param {Object} data Изменённые поля
         * @return {*}
         */
        updateProfile(data) {
            return this.httpModule.doPatch({
                url: this.routeMappings.me,
                data,
            });
        }
    }

    window.API = API;
})();
