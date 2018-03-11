(function() {
    /**
     * User profile settings
     */
    class SettingsBuilder extends window.AbstractBuilder {
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
            const avatarLink = (this.data.avatarLink ? (backendURI + this.data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            const template = settingsTemplate({
                avatarLink,
                uploadAvatarLink: backendURI + '/me/avatar',
                meLink: backendURI + '/me',
                username: this._data.username,
                email: this._data.email,
            });
            this.node.insertAdjacentHTML('afterbegin', template);
            // this.node.innerHTML = `
            // DEEEESIIIIIIIGGGGGGNNNNNNNNNNNN!!!!11
            // <div class="img-with-text">
            //     <img class="avatar" src="${avatarLink}"/>
            //     <form action="${backendURI + '/me/avatar/'}" method="POST" id="upload-avatar" enctype="multipart/form-data">
            //         <span class="upload-btn-wrapper">
            //             <button class="btn update">Update</button>
            //             <input type="file" name="avatar"/>
            //         </span>
            //     </form>
            //     <button class="btn delete" id="delete-avatar">Delete</button>
            // </div>
            // <form action="${backendURI + '/me/'}" class="settings__form" method="PATCH" id="update-info">
            //     <input type="text" class="settings__input" name="username" placeholder="${this.data.username}"/>
            //     <input type="text" class="settings__input" name="email" placeholder="${this.data.email}"/>
            //     <input type="password" class="settings__input" name="password" placeholder="new password"/>
            //     <input type="password" class="settings__input" name="password_confirmation" placeholder="confirmation"/>
            //     <input required class="settings__input" type="submit" value="Update">
            // </form>
            // <a href="#" id="logout" data-section="menu">LOG OUT</a>
            // `;


            const signinBuilder = window.application.signinPage.builder;

            document.getElementById('logout').addEventListener('click', signinBuilder.logoutMe.bind(signinBuilder));
            const form = document.getElementById('upload-avatar');
            form.addEventListener('change', () => this.setAvatar(form));
            document.getElementById('delete-avatar').addEventListener('click', this.removeAvatar.bind(this));
            document.getElementById('update-info').addEventListener('submit', this.onSubmitUpdateForm.bind(this));
        };

        /**
         * Удаляет аватар пользователя.
         */
        removeAvatar() {
            const push = window.application.push;

            this.api.deleteAvatar()
                .then((response) => {
                    this.data = response;
                    this.render();
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
            const push = window.application.push;

            this.api.uploadAvatar(form)
                .then((response) => {
                    debugger;
                    this.data = response;
                    this.render();
                    push.data = 'Avatar updated';
                    push.render('success');
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        /**
         * @param {*} event
         */
        onSubmitUpdateForm(event) {
            const push = window.application.push;
            event.preventDefault();
            const form = event.currentTarget;
            const result = this.validator.validateCredentials(form, push, true);
            if (result.err) {
                return;
            }
            this.api.updateProfile(result.formData)
                .then((response) => {
                    push.data = 'Info updated';
                    push.render('success');
                    window.application.profilePage.builder.updateBar(response.username);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }

    window.SettingsBuilder = SettingsBuilder;
})();
