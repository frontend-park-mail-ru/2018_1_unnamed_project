'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница профиля пользователя.
     */
    class ProfilePage extends AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'profile'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', profilePageTemplate({pageId}));
            this._builder = new window.ProfileBuilder('.profile');
        }

        /**
         * Отображает страницу.
         */
        show() {
            super.show();

            this.api.getMe()
                .then((response) => {
                    this.builder.data = response;
                    this.builder.render();
                });
        }
    }

    window.ProfilePage = ProfilePage;
})();
