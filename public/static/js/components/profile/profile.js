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

        /**
         *
         */
        render() {
            super.render();

            const backendURI = this.api.backendURI;

            // noinspection JSUnresolvedVariable
            const avatarLink = (this._data.avatarLink ?
                (backendURI + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            // noinspection JSUnresolvedFunction
            const template = profileTemplate({
                avatarLink,
                uploadAvatarLink: backendURI + '/me/avatar',
                username: this._data.username,
                email: this._data.email,
                rank: this._data.rank,
            });
            this.node.insertAdjacentHTML('afterbegin', template);

            const profileBuilder = window.application.profilePage.builder;
            const signinBuilder = window.application.signinPage.builder;

            document.getElementById('logout').addEventListener('click', signinBuilder.logoutMe.bind(signinBuilder));
            const form = document.getElementById('upload-avatar');
            form.addEventListener('change', () => profileBuilder.setAvatar(form));
            document.getElementById('delete-avatar').addEventListener('click', this.removeAvatar.bind(this));
        }

        /**
         * Удаляет аватар пользователя.
         */
        removeAvatar() {
            const profileBuilder = window.application.profilePage.builder;
            const push = window.application.push;

            this.api.deleteAvatar()
                .then((response) => {
                    profileBuilder.data = response;
                    profileBuilder.render();
                    push.data = 'Avatar deleted';
                    push.render('info');
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        /**
         * Устанавливает аватар пользователя.
         * @param {Object} form
         */
        setAvatar(form) {
            const profileBuilder = window.application.profilePage.builder;
            const push = window.application.push;

            this.api.uploadAvatar(form)
                .then((response) => {
                    profileBuilder.data = response;
                    profileBuilder.render();
                    push.data = 'Avatar updated';
                    push.render('success');
                })
                .catch((error) => {
                    console.error(error);
                });
        };
    }

    window.ProfileBuilder = ProfileBuilder;
})();
