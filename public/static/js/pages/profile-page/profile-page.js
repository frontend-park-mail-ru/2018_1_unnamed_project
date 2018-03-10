'use strict';

(function () {

	class ProfilePage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'profile'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="profile"></div>
		    </section>
			`;
		}
	}

	window.ProfilePage = ProfilePage;
})();
