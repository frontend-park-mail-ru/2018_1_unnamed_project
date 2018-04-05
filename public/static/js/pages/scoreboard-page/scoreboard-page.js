'use strict';

define('ScoreboardPage', (require) => {
    const AccessTypes = require('Page/access');
    const API = require('API');
    const Page = require('Page');

    const bus = require('bus');

    const Scoreboard = require('Scoreboard');
    const ScoreboardEvents = require('Scoreboard/events');

    const api = new API();

    /**
     * Страница списка лидеров.
     */
    return class ScoreboardPage extends Page {
        /**
         *
         */
        constructor() {
            super(scoreboardPageTemplate);

            this.setLoadPageHandler();
        }

        /**
         * @private
         * @return {ScoreboardPage}
         */
        setLoadPageHandler() {
            bus.on(ScoreboardEvents.LOAD_PAGE, (pagination) => {
                api
                    .scoreboard(pagination)
                    .then((response) => {
                        if (this._scoreboard) {
                            this._scoreboard.clear();
                            this._scoreboard.render(response);
                        }
                    })
                    .catch((err) => console.log(err));
            });

            return this;
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {ScoreboardPage}
         */
        render(attrs) {
            super.render(attrs);

            this._scoreboardRoot = this.element.querySelector('.js-scoreboard-root');
            this._scoreboard = new Scoreboard({element: this._scoreboardRoot, attrs: this.attrs});

            // Загрузка первой страницы - параметры пагинации не нужны.
            bus.emit(ScoreboardEvents.LOAD_PAGE, '');

            return this;
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
