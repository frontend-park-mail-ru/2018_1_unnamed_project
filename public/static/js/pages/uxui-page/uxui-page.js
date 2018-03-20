/* eslint-disable */
'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница cо сборкой всех UI элементов
     */
    class UxUiPage extends AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'uxui'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', uxuiPageTemplate({pageId}));
        }
    }

    window.UxUiPage = UxUiPage;
})();
