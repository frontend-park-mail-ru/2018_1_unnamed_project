import {Http} from "./http";

const BACKEND_URI = 'https://dev-api-shipcollision.herokuapp.com';

export class API {
    private _http;
    private _routeMappings;

    /**
     *
     */
    constructor() {
        this._http = Http;
        this._routeMappings = {
            me:         `${BACKEND_URI}/me`,
            signIn:     `${BACKEND_URI}/signin`,
            signUp:     `${BACKEND_URI}/users`,
            logout:     `${BACKEND_URI}/signout`,
            scoreboard: `${BACKEND_URI}/users/scoreboard`,
            avatar:     `${BACKEND_URI}/me/avatar`,
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
        return this._http.doGet({
            url: this._routeMappings.me,
        });
    }

    /**
     * POST /signin
     * @param {Object} data Данные пользователя.
     * @return {*}
     */
    signIn(data) {
        return this._http.doPost({
            url: this._routeMappings.signIn,
            data,
        });
    }

    /**
     * POST /users
     * @param {Object} data Данные пользователя.
     * @return {*}
     */
    signUp(data) {
        return this._http.doPost({
            url: this._routeMappings.signUp,
            data,
        });
    }

    /**
     * DELETE /signout
     * @return {*}
     */
    logout() {
        return this._http.doDelete({
            url: this._routeMappings.logout,
        });
    }

    /**
     * GET /users/scoreboard
     * @param {string} pagination offset and limit
     * @return {*}
     */
    scoreboard(pagination) {
        return this._http.doGet({
            url: this._routeMappings.scoreboard + pagination,
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
         * браузер сам коректно выставил boundaries для multipart/form-messages.
         */
        return this._http.doPost({
            url:         this._routeMappings.avatar,
            contentType: null,
            data,
        });
    }

    /**
     * DELETE /me/avatar
     * @return {*}
     */
    deleteAvatar() {
        return this._http.doDelete({
            url: this._routeMappings.avatar,
        });
    }

    /**
     * PATCH /me
     * @param {Object} data Изменённые поля
     * @return {*}
     */
    updateProfile(data) {
        return this._http.doPatch({
            url: this._routeMappings.me,
            data,
        });
    }
}
