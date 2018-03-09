(function () {

    const noop = () => null;

    class ProfleBuilder extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
        }

        updateBar() {
            signinBuilder.checkAuth();
        }

        render() {
            const avatarLink = (this._data.avatarLink ? (backendURL + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            this._node.innerHTML = `
            <div class="img-with-text">
                <img class="avatar" src="${avatarLink}"/>
                <form action="${backendURL + '/me/avatar/'}" method="post" id="upload-avatar" enctype="multipart/form-data">
                    <span class="upload-btn-wrapper">
                        <button class="btn update">Update</button>
                        <input type="file" name="avatar"/>
                    </span>
                </form>
                <a class="btn delete" id="delete-avatar">Delete</a>
                <hr>
                <a href="#" id="logout" data-section="menu">LOG OUT</a>
            </div>
            <div class="profile-info">
                <h4><i>Username: </i>${this._data.username}</h4>
                <h4><i>Email: </i>${this._data.email}</h4>
                <h4><i>Game rank: </i>${this._data.rank}</h4>
            </div>
            `;

            document.getElementById('logout').addEventListener('click', signinBuilder.logoutMe);
            const form = document.getElementById('upload-avatar');
            form.addEventListener('change', () => profileBuilder.setAvatar(form));
            document.getElementById('delete-avatar').addEventListener('click', this.removeAvatar);
        }

        removeAvatar() {
            api.deleteAvatar()
                .then(response => {
                    profileBuilder.data = response;
                    profileBuilder.render();
                    push.data = 'Avatar deleted';
                    push.render('info');
                })
                .catch(error => {
                    console.error(error);
                });
        }

        setAvatar(form) {
            api.uploadAvatar(form)
                .then(response => {
                    profileBuilder.data = response;
                    profileBuilder.render();
                    push.data = 'Avatar updated';
                    push.render('success');
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }

    window.ProfileBuilder = ProfleBuilder;

})();