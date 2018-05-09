import {GameEvents} from "../../game/events";
import bus from "../../modules/bus";
import {Component} from "../component";
import opponentsCountMenuTemplate from "./opponents-count-menu.pug";

import "./opponents-count-menu.css";

export class OpponentsCountMenu extends Component {
    /**
     * @param {object}   element          Элемент, в котором рендерить.
     * @param {function} templateFunction Функция отрисовки pug.
     * @param {object}   attrs            Параметры отрисовки.
     */
    constructor({element, attrs = {}}) {
        super({element, templateFunction: opponentsCountMenuTemplate, attrs});
    }

    /**
     * @override
     * @param {object} attrs
     * @return {OpponentsCountMenu}
     */
    render(attrs: object) {
        super.render(attrs);
        const buttons = this.element.querySelectorAll('.game__opponents-count-button');
        Object.values(buttons).forEach((btn: HTMLElement) => {
            btn.addEventListener('click', (evt) => {
                evt.preventDefault();

                bus.emit(
                    GameEvents.OfflineComponentsCountSelected,
                    {opponentsCount: parseInt((evt.target as any).value, 10) + 1},
                );
                this.element.hidden = true;
            });
        });
        return this;
    }
}
