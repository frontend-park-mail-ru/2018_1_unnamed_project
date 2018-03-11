'use strict';

(function() {
    /**
     * Страница одиночной игры.
     */
    class SingleplayerPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'singleplayer'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', singleplayerPageTemplate({pageId}));
        }
    }

    window.SingleplayerPage = SingleplayerPage;
})();
