'use strict';

define('ProfileBar', (require) => {
    const User = require('User');

    /**
     * Статусбар с данными текущего пользователя.
     */
    return class ProfileBar {
        /**
         *
         */
        constructor() {
            if (ProfileBar.__instance) {
                return ProfileBar.__instance;
            }

            this.element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
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
            return document.getElementById('profile-bar');
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
    };
});
