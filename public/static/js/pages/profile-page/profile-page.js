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
            this.parentNode.insertAdjacentHTML('beforeend', profilePageTemplate({pageId}));
            // this.parentNode.innerHTML += `
            // <section id="${pageId}" hidden>
            //     <div class="profile"></div>
            // </section>
            // `;
            // this._builder = new window.ProfileBuilder('.profile');
        }

        /**
         * Отображает страницу.
         */
        show() {
            super.show();

            const self = this;
            this.api.getMe()
                .then((response) => {
                    self._builder.data = response;
                    self._builder.render();
                });
        }
    }

    window.ProfilePage = ProfilePage;
})();
