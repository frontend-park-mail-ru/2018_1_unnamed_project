'use strict';

(function () {

	class SignUpPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'signup'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <form class="js-signup-form" novalidate></form>
		    </section>
			`;
		}
	}

	window.SignUpPage = SignUpPage;
})();
