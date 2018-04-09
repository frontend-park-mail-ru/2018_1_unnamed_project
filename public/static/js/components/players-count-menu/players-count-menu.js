'use strict';

define('PlayersCountMenu', (require) => {
    const Component = require('Component');
    const gameBus = require('game/core/bus');
    const bus = require('bus');
    const gameEvents = require('game/core/events');

    return class PlayersCountMenu extends Component {
        /**
         * @param {Object}   element          Элемент, в котором рендерить.
         * @param {function} templateFunction Функция отрисовки pug.
         * @param {Object}   attrs            Параметры отрисовки.
         */
        constructor({element, templateFunction, attrs = {}}) {
            super({element, templateFunction: playersCountMenuTemplate, attrs});
        }

        /**
         * @param {Object} attrs
         */
        render(attrs) {
            super.render(attrs);
            const buttons = this.element.querySelectorAll('.game__pCountBTN');
            Object.values(buttons).forEach((btn) => btn.addEventListener('click', (evt) => {
                evt.preventDefault();
                bus.emit(gameEvents.OFFLINE_PLAYERS_COUNT_SELECTED, {playersCount: parseInt(evt.target.value) + 1});
                this.element.hidden = true;
            }));
        };
    };
});
