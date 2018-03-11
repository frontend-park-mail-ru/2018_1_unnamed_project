'use strict';

(function() {
    /**
     * Страница мультиплеера.
     */
    class MultiplayerPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'multiplayer'} = {}) {
            super({parentId, pageId});
            this.parentNode.innerHTML += `
            <section id="${pageId}" hidden>
                <div class="multiplayer"></div>
            </section>
            `;
            this._builder = new window.Multiplayer('.multiplayer');
        }

        /**
         * Отображает страницу.
         */
        show() {
            super.show();

            const self = this;
            this.api.getMe()
                .then(() => self._builder.render())
                .catch(() => window.router.navigateTo('signin'));
        }
    }

    window.MultiplayerPage = MultiplayerPage;
})();
