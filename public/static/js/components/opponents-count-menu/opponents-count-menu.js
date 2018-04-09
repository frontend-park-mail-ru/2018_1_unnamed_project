'use strict';

define('OpponentsCountMenu', (require) => {
    const Component = require('Component');
    const gameBus = require('game/core/bus');
    const bus = require('bus');
    const gameEvents = require('game/core/events');

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
         * @param {Object} attrs
         */
        render(attrs) {
            super.render(attrs);
            const buttons = this.element.querySelectorAll('.game__opponents-count-button');
            Object.values(buttons).forEach((btn) => btn.addEventListener('click', (evt) => {
                evt.preventDefault();
                bus.emit(gameEvents.OFFLINE_OPPONENTS_COUNT_SELECTED, {opponentsCount: parseInt(evt.target.value) + 1});
                this.element.hidden = true;
            }));
        };
    };
});
