'use strict';

(function() {
    const AbstractBuilder = window.AbstractBuilder;
    /**
     * Компонент для орисовки профиля пользователя.
     */
    class ProfileBuilder extends AbstractBuilder {
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
            const avatarLink = (this._messages.avatarLink ?
                (backendURI + this._messages.avatarLink)
                :
                'https://www.shareicon.net/messages/128x128/2016/08/05/806962_user_512x512.png');
            // noinspection JSUnresolvedFunction
            const template = profileTemplate({
                avatarLink,
                uploadAvatarLink: `${backendURI}/me/avatar`,
                username: this._messages.username,
                email: this._messages.email,
                rank: this._messages.rank,
            });
            this.node.insertAdjacentHTML('afterbegin', template);
            document.getElementById('settings').addEventListener('click', window.anchorSubmitListener);
        }
    }

    window.ProfileBuilder = ProfileBuilder;
})();
