import {GameEvents} from '../../game/events';
import gameBus from '../../game/game-bus';
import {Component} from '../component';
import opponentsCountMenuTemplate from './opponents-count-menu.pug';

import './opponents-count-menu.scss';

export class OpponentsCountMenu extends Component {
    private static OPPONENTS_COUNT_BUTTON_SELECTOR = '.opponents-count-menu__button';
    private static DEFAULT_SELECTED_EVENT = GameEvents.OfflineOpponentsCountSelected;

    /**
     * @param {object}   element          Элемент, в котором рендерить.
     * @param {function} templateFunction Функция отрисовки pug.
     * @param {object}   attrs            Параметры отрисовки.
     */
    constructor({element, attrs = {onSelectedEvent: OpponentsCountMenu.DEFAULT_SELECTED_EVENT}}) {
        super({element, templateFunction: opponentsCountMenuTemplate, attrs: attrs as any});
    }

    /**
     * @override
     * @param {object} attrs
     * @return {OpponentsCountMenu}
     */
    render(attrs: object) {
        super.render(attrs);
        const buttons = this.element.querySelectorAll(OpponentsCountMenu.OPPONENTS_COUNT_BUTTON_SELECTOR);
        Object.values(buttons).forEach((btn: HTMLElement) => {
            btn.addEventListener('click', (evt) => {
                evt.preventDefault();

                const {onSelectedEvent} = this.attrs;

                gameBus.emit(
                    onSelectedEvent,
                    {opponentsCount: parseInt((evt.target as any).value, 10) + 1},
                );
                this.element.hidden = true;
            });
        });
        return this;
    }
}
