'use strict';

(function() {
    /**
     * Страница лидеров.
     */
    class ScoreboardPage extends window.AbstractPage {
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
         */
        show() {
            super.show();

            const self = this;
            this.api.scoreboard()
                .then((users) => {
                    self._builder.data = users;
                    self._builder.render();
                });
        }
    }

    window.ScoreboardPage = ScoreboardPage;
})();
