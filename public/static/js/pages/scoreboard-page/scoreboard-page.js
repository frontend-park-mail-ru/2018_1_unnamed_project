'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница лидеров.
     */
    class ScoreboardPage extends AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'scoreboard'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', scoreboardPageTemplate({pageId}));
            this._builder = new window.ScoreboardBuilder('.js-scoreboard-table');
        }

        /**
         * Отображает страницу.
         * @param {string} pagination offset and limit param
         */
        show(pagination = '') {
            super.show();
            this.api.scoreboard(pagination)
                .then((users) => {
                    this.builder.data = users;
                    this.builder.render();
                });
        }
    }

    window.ScoreboardPage = ScoreboardPage;
})();
