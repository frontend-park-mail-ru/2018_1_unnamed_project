'use strict';

define('MenuPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

    /**
     * Главная страница.
     */
    return class MenuPage extends Page {
        /**
         * Возвращает артрибуты по умолчанию.
         * @return {{navItems: *[]}}
         */
        static get defaultAttrs() {
            return {
                'navItems': [
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
                ],
            };
        }

        /**
         *
         */
        constructor() {
            super(menuPageTemplate);

            this.attrs = MenuPage.defaultAttrs;
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
