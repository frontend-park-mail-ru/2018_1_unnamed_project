'use strict';

(function() {
    /**
     * Страница профиля пользователя.
     */
    class ProfilePage extends window.AbstractPage {
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
                    this._builder.data = response;
                    this._builder.render();
                });
        }
    }

    window.ProfilePage = ProfilePage;
})();
