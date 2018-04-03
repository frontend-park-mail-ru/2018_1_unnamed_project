'use strict';

define('MenuPage', (require) => {
    const Page = require('Page');
    const AccessTypes = require('Page/access');

    /**
     * Главная страница.
     */
    return class MenuPage extends Page {
        /**
         *
         */
        constructor() {
            super(menuPageTemplate);
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {Page}
         */
        render(attrs) {
            attrs = attrs || {};
            attrs.navItems = [
                {
                    title: 'Мультиплеер',
                    href: '/multiplayer',
                },
                {
                    title: 'Одиночная игра',
                    href: '/singleplayer',
                },
                {
                    title: 'Таблица лидеров',
                    href: '/scoreboard',
                },
                {
                    title: 'Правила',
                    href: '/rules',
                },
            ];

            return super.render(attrs);
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.ANY_USER;
        }
    };
});
