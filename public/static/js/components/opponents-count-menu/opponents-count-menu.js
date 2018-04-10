'use strict';

define('OpponentsCountMenu', (require) => {
    const Component = require('Component');
    const GameEvents = require('game/core/events');
    const bus = require('bus');

    return class OpponentsCountMenu extends Component {
        /**
         * @param {Object}   element          Элемент, в котором рендерить.
         * @param {function} templateFunction Функция отрисовки pug.
         * @param {Object}   attrs            Параметры отрисовки.
         */
        constructor({element, templateFunction, attrs = {}}) {
            super({element, templateFunction: opponentsCountMenuTemplate, attrs});
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {OpponentsCountMenu}
         */
        render(attrs) {
            super.render(attrs);
            const buttons = this.element.querySelectorAll('.game__opponents-count-button');
            Object.values(buttons).forEach((btn) => btn.addEventListener('click', (evt) => {
                evt.preventDefault();
                bus.emit(GameEvents.OFFLINE_OPPONENTS_COUNT_SELECTED, {opponentsCount: parseInt(evt.target.value) + 1});
                this.element.hidden = true;
            }));
            return this;
        };
    };
});
