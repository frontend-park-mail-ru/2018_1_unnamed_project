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
            console.log(backendURI);
            const avatarLink = (this.data.avatarLink ? (backendURI + this.data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            this.node.innerHTML = `
            DEEEESIIIIIIIGGGGGGNNNNNNNNNNNN
            <div class="img-with-text">
                <img class="avatar" src="${avatarLink}"/>
                <form action="${backendURI + '/me/avatar/'}" method="POST" id="upload-avatar" enctype="multipart/form-data">
                    <span class="upload-btn-wrapper">
                        <button class="btn update">Update</button>
                        <input type="file" name="avatar"/>
                    </span>
                </form>
                <a class="btn delete" id="delete-avatar">Delete</a>
            </div>
            <form action="${backendURI + '/me/'}" class="settings__form" method="PATCH" id="update-info">
                <input type="text" name="username" placeholder="${this.data.username}"/>
                <input type="text" name="email" placeholder="${this.data.email}"/>
                <input type="password" name="password" placeholder="new password"/>
                <input type="password_confirmation" name="password_confirmation" placeholder="again"/>
            </form>
            <a href="#" id="logout" data-section="menu">LOG OUT</a>
            `;


            const signinBuilder = window.application.signinPage.builder;

            document.getElementById('logout').addEventListener('click', signinBuilder.logoutMe.bind(signinBuilder));
            const form = document.getElementById('upload-avatar');
            form.addEventListener('change', () => this.setAvatar(form));
            document.getElementById('delete-avatar').addEventListener('click', this.removeAvatar.bind(this));
        };

        /**
         * Удаляет аватар пользователя.
         */
        removeAvatar() {
            const settingsBuilder = window.application.settingsPage.builder;
            const push = window.application.push;

            this.api.deleteAvatar()
                .then((response) => {
                    settingsBuilder.data = response;
                    settingsBuilder.render();
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
            const settingsBuilder = window.application.settingsPage.builder;
            const push = window.application.push;

            this.api.uploadAvatar(form)
                .then((response) => {
                    debugger;
                    settingsBuilder.data = response;
                    settingsBuilder.render();
                    push.data = 'Avatar updated';
                    push.render('success');
                })
                .catch((error) => {
                    console.error(error);
                });
        };
    }

    window.SettingsBuilder = SettingsBuilder;
})();
