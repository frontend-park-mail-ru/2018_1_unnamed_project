import {Push, PushLevels} from "../components/push/push";
import {API} from "../modules/api";
import bus from "../modules/bus";
import {RouterEvents} from "../modules/router";

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
function renderErrors(errors) {
    const push = new Push();

    errors.forEach((err) => {
        push.addMessage(err);
        console.log(err);
    });

    push.render({level: PushLevels.Error});
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
export class User {
    /**
     * @return {User|*}
     */
    static get currentUser() {
        return currentUser;
    }
    
    /**
     * Проверяет авторизацию пользователя.
     * @return {Promise<Object>}
     */
    static checkCurrentUser() {
        return api
            .getMe()
            .then((response) => {
                // noinspection ReuseOfLocalVariableJS
                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                
                return currentUser;
            })
            .catch((errors) => {
                console.log(errors);
                // noinspection ReuseOfLocalVariableJS
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                
                throw new Error();
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
                // noinspection ReuseOfLocalVariableJS
                currentUser = new User(response);
                renderHello(currentUser.username);
                
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                bus.emit(UserEvents.AuthenticationDone, currentUser);
                bus.emit(RouterEvents.NavigateToNextPageOrRoot, null);
            })
            .catch((errors) => {
                renderErrors(errors);
                // noinspection ReuseOfLocalVariableJS
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
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
                // noinspection ReuseOfLocalVariableJS
                currentUser = new User(response);
                renderHello(currentUser.username);
                
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                bus.emit(UserEvents.AuthenticationDone, currentUser);
                bus.emit(RouterEvents.NavigateToNextPageOrRoot, null);
            })
            .catch((errors) => {
                renderErrors(errors);
                // noinspection ReuseOfLocalVariableJS
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
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
                push.render({level: PushLevels.Info});
                
                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
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
                push.render({level: PushLevels.Info});
                
                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
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
                push.render({level: PushLevels.Error});
                
                // noinspection ReuseOfLocalVariableJS
                currentUser = new User(response);
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
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
            .then(() => {
                currentUser = null;
                bus.emit(UserEvents.CurrentUserChanged, currentUser);
                bus.emit(RouterEvents.NavigateToPage, '/');
            })
            .catch((errors) => {
                console.log(errors);
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
    private resolveAvatarLink(avatarLink) {
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
