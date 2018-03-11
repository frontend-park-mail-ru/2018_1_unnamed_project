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
         */
        updateBar() {
            window.signinPage.builder.checkAuth();
        }

        /**
         *
         */
        render() {
            const backendURI = this.api.backendURI;

            // noinspection JSUnresolvedVariable
            const avatarLink = (this._data.avatarLink ?
                (backendURI + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            const template = profileTemplate({
                avatarLink,
                uploadAvatarLink: backendURI + '/me/avatar',
                user: this._data,
            });
            this.node.insertAdjacentHTML('afterbegin', template);
            // noinspection JSUnresolvedVariable
            // this.node.innerHTML = `
            // <div class="img-with-text">
            //     <img class="avatar" src="${avatarLink}"/>
            //     <form action="${backendURI + '/me/avatar/'}" method="post" id="upload-avatar" enctype="multipart/form-data">
            //         <span class="upload-btn-wrapper">
            //             <button class="btn update">Update</button>
            //             <input type="file" name="avatar"/>
            //         </span>
            //     </form>
            //     <a class="btn delete" id="delete-avatar">Delete</a>
            //     <hr>
            //     <a href="#" id="logout" data-section="menu">LOG OUT</a>
            // </div>
            // <div class="profile-info">
            //     <h4><i>Username: </i>${this._data.username}</h4>
            //     <h4><i>Email: </i>${this._data.email}</h4>
            //     <h4><i>Game rank: </i>${this._data.rank}</h4>
            // </div>
            // `;

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
