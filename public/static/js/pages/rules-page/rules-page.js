/* eslint-disable */
'use strict';

(function() {
    /**
     * Страница с праилами игры
     */
    class RulesPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'rules'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', rulesPageTemplate({pageId}));
        }
    }

    window.RulesPage = RulesPage;
})();
