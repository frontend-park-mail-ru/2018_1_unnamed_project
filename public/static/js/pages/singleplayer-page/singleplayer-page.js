'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница одиночной игры.
     */
    class SingleplayerPage extends AbstractPage {
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
