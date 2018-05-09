import {User} from "../../models/user";
import {Component} from "../component";
import {Push} from "../push/push";
import profileBarTemplate from "./profile-bar.pug";

import "./profile-bar.css";

export class ProfileBar extends Component {
    static _Instance: ProfileBar;

    /**
     *
     */
    constructor({element}) {
        if (ProfileBar._Instance) {
            return ProfileBar._Instance;
        }

        super({element, templateFunction: profileBarTemplate, attrs: {mainActionHref: '/signin'} as object});

        this
            .render(this.attrs)
            .setUnauthorized()
            .hide();

        this.element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
            evt.preventDefault();

            const push = new Push();
            push.clearSharedMessages();

            User.logout();
        });

        ProfileBar._Instance = this;
    }

    /**
     * Задает имя пользователя.
     * @private
     * @param {string} text
     */
    set username(text) {
        this.element.querySelector('#profile-bar__username').innerText = text;
    }

    private set href(mainActionHref) {
        this.element.querySelector('#profile-bar__username').href = mainActionHref;
    }

    /**
     * Задает доступность ссылки "выход".
     * @private
     * @param {boolean} available
     */
    private set logoutAvailable(available) {
        const logout = this.element.querySelector('#profile-bar__logout');
        if (available) {
            logout.removeAttribute('hidden');
        } else {
            logout.setAttribute('hidden', 'true');
        }
    }

    /**
     * Устанавливает компонент в состояние "авторизован".
     * @param {string} username
     */
    setAuthorized(username) {
        this.username = username;
        this.href = '/profile';
        this.logoutAvailable = true;
    }

    /**
     * Устанавливат компонент в состояние "не авторизован".
     */
    setUnauthorized() {
        this.username = 'войти';
        this.href = '/signin';
        this.logoutAvailable = false;
        return this;
    }

    /**
     * Скрывает компонент.
     * @return {ProfileBar}
     */
    hide() {
        this.element.setAttribute('hidden', 'hidden');
        return this;
    }

    /**
     * Показывает компонент
     * @return {ProfileBar}
     */
    show() {
        this.element.removeAttribute('hidden');
        return this;
    }
}
