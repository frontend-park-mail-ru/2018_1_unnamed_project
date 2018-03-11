(function() {

    class SettingsBuilder extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
        }

        render() {
            const avatarLink = (this._data.avatarLink ? (backendURL + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            this._node.innerHTML = `
            DEEEESIIIIIIIGGGGGGNNNNNNNNNNNN
            <div class="img-with-text">
                <img class="avatar" src="${avatarLink}"/>
                <form action="${backendURL + '/me/avatar/'}" method="POST" id="upload-avatar" enctype="multipart/form-data">
                    <span class="upload-btn-wrapper">
                        <button class="btn update">Update</button>
                        <input type="file" name="avatar"/>
                    </span>
                </form>
                <a class="btn delete" id="delete-avatar">Delete</a>
            </div>
            <form action="${backendURL + '/me/'}" class="settings__form" method="PATCH" id="update-info">
                <input type="text" name="username" placeholder="${this._data.username}"/>
                <input type="text" name="email" placeholder="${this._data.email}"/>
                <input type="password" name="password" placeholder="new password"/>
                <input type="password_confirmation" name="password_confirmation" placeholder="again"/>
            </form>
            <a href="#" id="logout" data-section="menu">LOG OUT</a>
            `;

            document.getElementById('logout').addEventListener('click', signinBuilder.logoutMe);
            const form = document.getElementById('upload-avatar');
            form.addEventListener('change', () => this.setAvatar(form));
            document.getElementById('delete-avatar').addEventListener('click', this.removeAvatar);

        }

        removeAvatar() {
            api.deleteAvatar()
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

        setAvatar(form) {
            api.uploadAvatar(form)
                .then((response) => {
                    settingsBuilder.data = response;
                    settingsBuilder.render();
                    push.data = 'Avatar updated';
                    push.render('success');
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    window.SettingsBuilder = SettingsBuilder;
})();
