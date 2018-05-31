import {Page, PageAccessTypes} from '../page';
import menuPageTemplate from './menu-page.pug';

import './menu-page.scss';

export class MenuPage extends Page {
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
            navItems: [
                // {
                //     title: 'Мультиплеер',
                //     href: '/multiplayer',
                // },
                {
                    title: 'Одиночная игра',
                    href: '/singleplayer',
                },
                {
                    title: 'Таблица лидеров',
                    href: '/scoreboard',
                },
                {
                    title: 'Как играть',
                    href: '/rules',
                },
            ],
        };
    }

    /**
     * @override
     * @param {object} attrs
     * @returns {Page}
     */
    render(attrs: object): MenuPage {
        super.render(attrs);
        this.profileBar.show();
        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }
}
