'use strict';

(function() {
    /**
     * Компонент для орисовки профиля пользователя.
     */
    class ProfileBuilder extends window.AbstractBuilder {
        /**
         * @param {string} selector
         */
        constructor(selector) {
            super(selector);
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Метод для обновления строки с аватаром пользователя.
         * @param {string} username
         */
        updateBar(username = '') {
            if (username === '') {
                window.application.signinPage.builder.checkAuth();
            } else {
                window.application.profileBar.innerText = username;
            }
        }

        /**
         *
         */
        render() {
            super.render();

            const backendURI = this.api.backendURI;

            // noinspection JSUnresolvedVariable
            const avatarLink = (this._data.avatarLink ?
                (backendURI + this._data.avatarLink)
                :
                'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            // noinspection JSUnresolvedFunction
            const template = profileTemplate({
                avatarLink,
                uploadAvatarLink: `${backendURI}/me/avatar`,
                username: this._data.username,
                email: this._data.email,
                rank: this._data.rank,
            });
            this.node.insertAdjacentHTML('afterbegin', template);
            document.getElementById('settings').addEventListener('click', window.anchorSubmitListener);
        }
    }

    window.ProfileBuilder = ProfileBuilder;
})();
