import {Loader} from '../components/loader/loader';
import {PushLevels} from '../components/message-container';
import {Push} from '../components/push/push';
import {API} from '../modules/api';
import bus from '../modules/bus';
import {HttpResponse} from '../modules/http';
import {RouterEvents} from '../modules/router';

export type UserResponse = Promise<User>;

export enum UserEvents {
    AuthenticationDone = 'authentication_done',
    CurrentUserChanged = 'current_user_changed',
}

const api = new API();

const DEFAULT_AVATAR_LINK =
    'https://cdn.weasyl.com/static/media/61/c0/6f/61c06fe056b415366fc32ed9914058a30098ba0264ffed0b9e1108610bd4f2f1.png';

let currentUser = null;

/**
 * Вспомогатльная функция для отрисовки ошибок.
 * @param {Array} errors
 */
function renderErrors(errors: Iterable<string>): void {
    const push = new Push();

    for (const err of errors) {
        push.addMessage(err);
    }

    push.render({level: PushLevels.Error});
}

/**
 * Вспомогательная функция для рендеринга приветственного сообщения.
 * @param {string} username
 */
function renderHello(username: string): void {
    const push = new Push();
    push.addSharedMessage(`Добро пожаловать, ${username}`);
}

/**
 * Модель пользователя.
 * @note Текущий пользователь сохраняется в LocalStorage.
 */
export class User {
    /**
     * @return {User|*}
     */
    public static get currentUser(): User {
        return currentUser;
    }

    /**
     * Проверяет авторизацию пользователя.
     * @return {Promise<Object>}
     */
    public static checkCurrentUser(): UserResponse {
        return api
            .getMe()
            .then((response: HttpResponse) => {
                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                return currentUser;
            })
            .catch(() => {
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                throw new Error();
            });
    }

    /**
     * Авторизует пользователя.
     * @param {*} credentials
     */
    public static signIn(credentials: any) {
        const loader = new Loader();

        api
            .signIn(credentials)
            .then((response: HttpResponse) => {
                loader.hide();

                currentUser = new User(response);
                renderHello(currentUser.username);

                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                bus.emit(UserEvents.AuthenticationDone, currentUser);
                bus.emit(RouterEvents.NavigateToNextPageOrRoot, null);
            })
            .catch((errors: any) => {
                loader.hide();

                renderErrors(errors);
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
            });
    }

    /**
     * Создает пользователя.
     * @param {*} credentials
     */
    public static signUp(credentials: any) {
        const loader = new Loader();

        api
            .signUp(credentials)
            .then((response: HttpResponse) => {
                loader.hide();

                currentUser = new User(response);
                renderHello(currentUser.username);

                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                bus.emit(UserEvents.AuthenticationDone, currentUser);
                bus.emit(RouterEvents.NavigateToNextPageOrRoot, null);
            })
            .catch((errors: any) => {
                loader.hide();

                renderErrors(errors);
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
            });
    }

    /**
     * Обновляет данные пользователя.
     * @param {*} data
     */
    public static update(data: any) {
        const loader = new Loader();
        loader.show();

        api
            .updateProfile(data)
            .then((response) => {
                loader.hide();

                const push = new Push();
                push.addMessage('Настройки обновлены');
                push.render({level: PushLevels.Info});

                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
            })
            .catch((errors) => {
                loader.hide();
                renderErrors(errors);
            });
    }

    /**
     * Изменяет аватар пользователя.
     * @param {*} form
     */
    public static changeAvatar(form: any) {
        const loader = new Loader();
        loader.show();

        api
            .uploadAvatar(form)
            .then((response) => {
                loader.hide();

                const push = new Push();
                push.addMessage('Аватар обновлен');
                push.render({level: PushLevels.Info});

                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
            })
            .catch((errors) => {
                loader.hide();
                renderErrors(errors);
            });
    }

    /**
     * Удаляет аватар пользователя.
     */
    public static deleteAvatar() {
        const loader = new Loader();
        loader.show();

        api
            .deleteAvatar()
            .then((response) => {
                loader.hide();

                const push = new Push();
                push.addMessage('Аватар пользователя удален');
                push.render({level: PushLevels.Info});

                currentUser = new User(response);
                currentUser.avatarLink = DEFAULT_AVATAR_LINK;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
            })
            .catch((errors) => {
                loader.hide();
            });
    }

    /**
     * Осуществляет выход пользователя.
     */
    public static logout() {
        const logoutCallback = () => {
            currentUser = null;
            bus.emit(UserEvents.CurrentUserChanged, currentUser);
            bus.emit(RouterEvents.NavigateToPage, '/');
        };

        api
            .logout()
            .then(logoutCallback)
            .catch((errors) => {
                logoutCallback();
            });
    }

    public username: string;
    public email: string;
    public rank: number;
    public avatarLink: string;
    public uploadAvatarLink: string;

    /**
     * @param {Object} data
     */
    constructor(data: any) {
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
    private resolveAvatarLink(avatarLink: string): string {
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
}
