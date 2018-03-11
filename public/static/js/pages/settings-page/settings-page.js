'use strict';

(function() {
    /**
     * Страница настроек профиля пользователя.
     */
    class SettingsPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'settings'} = {}) {
            super({parentId, pageId});
            this.parentNode.innerHTML += `
            <section id="${pageId}" hidden>
                <div class="settings"></div>
            </section>
            `;
            this._builder = new window.SettingsBuilder('.settings');
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

    window.SettingsPage = SettingsPage;
})();