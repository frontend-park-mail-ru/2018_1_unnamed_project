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

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', multiplayerPageTemplate({pageId}));
            this._builder = new window.Multiplayer('.multiplayer');
        }

        /**
         * Отображает страницу.
         */
        show() {
            super.show();

            this.api.getMe()
                .then(() => this.builder.render())
                .catch(() => window.router.navigateTo('signin'));
        }
    }

    window.MultiplayerPage = MultiplayerPage;
})();
