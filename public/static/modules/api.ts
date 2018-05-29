import {Http, HttpResponse} from './http';

const LOCALHOST = 'http://localhost:8080';
const HEROKU = 'https://dev-api-shipcollision.herokuapp.com';
const BACKEND_URI = HEROKU;

interface IRouteMappings {
    me: string;
    signIn: string;
    signUp: string;
    logout: string;
    scoreboard: string;
    avatar: string;
}

export class API {
    private _http: typeof Http;
    private _routeMappings: IRouteMappings;

    /**
     *
     */
    constructor() {
        this._http = Http;
        this._routeMappings = {
            me: `${BACKEND_URI}/me`,
            signIn: `${BACKEND_URI}/signin`,
            signUp: `${BACKEND_URI}/users`,
            logout: `${BACKEND_URI}/signout`,
            scoreboard: `${BACKEND_URI}/users/scoreboard`,
            avatar: `${BACKEND_URI}/me/avatar`,
        };
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Возвращает текущий базовый URI бекенда.
     * @return {string}
     */
    public get backendURI(): string {
        return BACKEND_URI;
    }

    /**
     * GET /me
     * @return {*}
     */
    public getMe(): HttpResponse {
        return this._http.doGet({
            uri: this._routeMappings.me,
        });
    }

    /**
     * POST /signin
     * @param {Object} data Данные пользователя.
     * @return {*}
     */
    public signIn(data): HttpResponse {
        return this._http.doPost({
            uri: this._routeMappings.signIn,
            data,
        });
    }

    /**
     * POST /users
     * @param {Object} data Данные пользователя.
     * @return {*}
     */
    public signUp(data): HttpResponse {
        return this._http.doPost({
            uri: this._routeMappings.signUp,
            data,
        });
    }

    /**
     * DELETE /signout
     * @return {*}
     */
    public logout(): HttpResponse {
        return this._http.doDelete({
            uri: this._routeMappings.logout,
        });
    }

    /**
     * GET /users/scoreboard
     * @param {string} pagination offset and limit
     * @return {*}
     */
    public scoreboard(pagination): HttpResponse {
        return this._http.doGet({
            uri: this._routeMappings.scoreboard + pagination,
        });
    }

    /**
     * POST /me/avatar
     * @param {Object} data Файл с картинкой.
     * @return {*}
     */
    public uploadAvatar(data): HttpResponse {
        /**
         * Content-Type выставляется в null для того, чтобы
         * браузер сам коректно выставил boundaries для multipart/form-messages.
         */
        return this._http.doPost({
            uri: this._routeMappings.avatar,
            contentType: null,
            data,
        });
    }

    /**
     * DELETE /me/avatar
     * @return {*}
     */
    public deleteAvatar(): HttpResponse {
        return this._http.doDelete({
            uri: this._routeMappings.avatar,
        });
    }

    /**
     * PATCH /me
     * @param {Object} data Изменённые поля
     * @return {*}
     */
    public updateProfile(data): HttpResponse {
        return this._http.doPatch({
            uri: this._routeMappings.me,
            data,
        });
    }
}
