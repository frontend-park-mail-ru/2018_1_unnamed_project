import {Page, PageAccessTypes} from "../page";
import menuPageTemplate from "./menu-page.pug";

import "./menu-page.css";

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
                {
                    title: 'Мультиплеер',
                    href:  '/multiplayer',
                },
                {
                    title: 'Одиночная игра',
                    href:  '/singleplayer',
                },
                {
                    title: 'Таблица лидеров',
                    href:  '/scoreboard',
                },
                {
                    title: 'Правила',
                    href:  '/rules',
                },
            ],
        };
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }
}
