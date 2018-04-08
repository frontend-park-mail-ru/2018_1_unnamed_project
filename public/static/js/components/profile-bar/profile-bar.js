'use strict';

define('ProfileBar', (require) => {
    const User = require('User');
    const Component = require('Component');
    /**
     * Статусбар с данными текущего пользователя.
     */
    return class ProfileBar extends Component {
        /**
         *
         */
        constructor({element, templateFunction, attrs = {}}) {
            super({element, templateFunction, attrs});
            if (ProfileBar.__instance) {
                return ProfileBar.__instance;
            }

            this._element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
                evt.preventDefault();
                User.logout();
            });

            this.setUnauthorized();
            this.hide();

            ProfileBar.__instance = this;
        }


        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает ссылку на базовый элемент компонента.
         * @private
         * @return {HTMLElement | null}
         */
        get element() {
            return this._element;
        }

        /**
         * Изменяет значение базового элемента компонента.
         * @private
         * @param {HTMLElement | null} data
         */
        set element(data) {
            this._element = data;
        }

        /**
         * Задает имя пользователя.
         * @private
         * @param {string} text
         */
        set username(text) {
            this._element.querySelector('#profile-bar__username').innerText = text;
        }

        /**
         * Задает доступность ссылки "выход".
         * @private
         * @param {boolean} available
         */
        set logoutAvailable(available) {
            const logout = this._element.querySelector('#profile-bar__logout');
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
        }

        /**
         * Скрывает компонент.
         * @return {ProfileBar}
         */
        hide() {
            this._element.setAttribute('hidden', 'hidden');
            return this;
        }

        /**
         * Показывает компонент
         * @return {ProfileBar}
         */
        show() {
            this._element.removeAttribute('hidden');
            return this;
        }
    };
});
