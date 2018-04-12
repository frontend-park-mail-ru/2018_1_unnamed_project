import {User} from "../../models/user";
import {Component} from "../component";
import profileBarTemplate from "./profile-bar.pug";

import "./profile-bar.css";

export class ProfileBar extends Component {
    static _Instance: ProfileBar;

    /**
     *
     */
    constructor({element, attrs = {}}) {
        if (ProfileBar._Instance) {
            return ProfileBar._Instance;
        }

        super({element, templateFunction: profileBarTemplate, attrs});

        this
            .render(attrs)
            .setUnauthorized()
            .hide();
    
        this.element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
            evt.preventDefault();
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

    /**
     * Задает доступность ссылки "выход".
     * @private
     * @param {boolean} available
     */
    set logoutAvailable(available) {
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
        this.logoutAvailable = true;
    }

    /**
     * Устанавливат компонент в состояние "не авторизован".
     */
    setUnauthorized() {
        this.username = 'вы не авторизованы';
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
