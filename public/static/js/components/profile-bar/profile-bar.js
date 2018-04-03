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
            this.element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
                evt.preventDefault();
                User.logout();
            });

            this.username = 'Unauthorized';
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
         * @param {string} text
         */
        set username(text) {
            this.element.querySelector('#profile-bar__username').innerText = text;
        }

        /**
         * Задает доступность ссылки "выход".
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
    };
});
