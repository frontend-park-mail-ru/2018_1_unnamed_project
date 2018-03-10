'use strict';

(function () {

	/**
	 * Компонент для орисовки профиля пользователя.
	 */
	class ProfileBuilder extends window.AbstractBuilder {

		constructor(selector) {
			super(selector);
		}

		// noinspection JSMethodCanBeStatic
		updateBar() {
			window.signinPage.builder.checkAuth();
		}

		render() {
			const backendURI = this.api.backendURI;

			// noinspection JSUnresolvedVariable
			const avatarLink = (this._data.avatarLink ?
				(backendURI + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
			// noinspection JSUnresolvedVariable
			this.node.innerHTML = `
            <div class="img-with-text">
                <img class="avatar" src="${avatarLink}"/>
                <form action="${backendURI + '/me/avatar/'}" method="post" id="upload-avatar" enctype="multipart/form-data">
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

			const profileBuilder = window.Application.profilePage.builder;
			const signinBuilder = window.Application.signinPage.builder;

			document.getElementById("logout").addEventListener('click', signinBuilder.logoutMe.bind(signinBuilder));
			const form = document.getElementById("upload-avatar");
			form.addEventListener('change', () => profileBuilder.setAvatar(form));
			document.getElementById("delete-avatar").addEventListener('click', this.removeAvatar.bind(this));
		}

		removeAvatar() {
			const profileBuilder = window.Application.profilePage.builder;
			const push = window.Application.push;

			this.api.deleteAvatar()
				.then(response => {
					profileBuilder.data = response;
					profileBuilder.render();
					push.data = 'Avatar deleted';
					push.render('info');
				})
				.catch(error => {
					console.error(error);
				})
		}

		setAvatar(form) {
			const profileBuilder = window.Application.profilePage.builder;
			const push = window.Application.push;

			this.api.uploadAvatar(form)
				.then(response => {
					profileBuilder.data = response;
					profileBuilder.render();
					push.data = 'Avatar updated';
					push.render('success');
				})
				.catch(error => {
					console.error(error);
				})
		};

	}

	window.ProfileBuilder = ProfileBuilder;
})();