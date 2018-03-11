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

            this.parentNode.innerHTML += `
            <section id="${pageId}" hidden>
                <div class="js-scoreboard-table"></div>
            </section>
            `;
            this._builder = new window.ScoreboardBuilder('.js-scoreboard-table');
        }

        /**
         * Отображает страницу.
         * @param {string} pagination offset and limit param
         */
        show(pagination = '') {
            super.show();

            const self = this;
            this.api.scoreboard(pagination)
                .then((users) => {
                    self._builder.data = users;
                    self._builder.render();
                });
        }
    }

    window.ScoreboardPage = ScoreboardPage;
})();
