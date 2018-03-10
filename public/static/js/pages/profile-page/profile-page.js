'use strict';

(function () {

	class ProfilePage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'profile'} = {}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="profile"></div>
		    </section>
			`;
			this._builder = new window.ProfileBuilder('profile');
		}

		show() {
			super.show();

			const self = this;
			this._api.getMe()
				.then(response => {
					self._builder.data = response;
					self._builder.render();
				});
		}
	}

	window.ProfilePage = ProfilePage;
})();
