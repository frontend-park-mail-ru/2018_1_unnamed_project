'use strict';

define('MenuPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

    /**
     * Главная страница.
     */
    return class MenuPage extends Page {
        /**
         *
         */
        constructor() {
            super(menuPageTemplate);

            this.attrs = MenuPage.defaultAttrs;
        }

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
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.ANY_USER;
        }
    };
});
