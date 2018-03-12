/* eslint-disable */
'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница с праилами игры
     */
    class RulesPage extends AbstractPage {
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
