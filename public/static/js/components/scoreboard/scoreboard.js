'use strict';

define('Scoreboard', (require) => {
    const Component = require('Component');

    const bus = require('bus');

    const events = require('Scoreboard/events');

    /**
     * Таблица лидеров.
     */
    return class Scoreboard extends Component {
        /**
         * @param {Object}   element Элемент, в котором рендерить.
         * @param {Object}   attrs   Параметры отрисовки.
         */
        constructor({element, attrs = {}}) {
            super({element, templateFunction: scoreboardTemplate, attrs});
        }

        /**
         * @private
         * @param {string} elementId
         * @param {string} pagination
         * @return {Scoreboard}
         */
        setPaginationHandler(elementId, pagination) {
            const button = document.getElementById(elementId);

            if (pagination) {
                button.onclick = (evt) => {
                    evt.preventDefault();
                    bus.emit(events.LOAD_PAGE, pagination);
                };
            } else {
                button.hidden = true;
            }

            return this;
        }

        /**
         * @param {Object} attrs
         * @return {Scoreboard}
         */
        render(attrs) {
            super.render(attrs);

            this.setPaginationHandler('prev', attrs.prevPage)
                .setPaginationHandler('next', attrs.nextPage);

            return this;
        }
    };
});
