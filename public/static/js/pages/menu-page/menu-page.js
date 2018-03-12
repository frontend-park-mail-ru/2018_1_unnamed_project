'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница меню.
     */
    class MenuPage extends AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'menu'} = {}) {
            super({parentId, pageId});

            this._templateFunction = menuPageTemplate;

            const template = this._templateFunction({pageId});
            this.parentNode.insertAdjacentHTML('beforeend', template);
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            window.application.signinPage.builder.checkAuth();
        }
    }

    window.MenuPage = MenuPage;
})();
