'use strict';

(function () {

	class SignInPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'signin'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <form class="js-signin-form" novalidate></form>
		    </section>
			`;
		}
	}
})();
