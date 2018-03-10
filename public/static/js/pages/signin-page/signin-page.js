'use strict';

(function () {

	class SignInPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'signin'} = {}) {
			super({parentId, pageId});
			this.parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <form class="js-signin-form" novalidate></form>
		    </section>
			`;
			this._builder = new window.AuthFormsBuilder('js-signin-form');
		}

		show() {
			super.show();
			this._builder.render();

			const self = this;
			this._builder.node.addEventListener(
				'submit',
				() => self.builder.onSubmitAuthForm(event, self.api.signIn.bind(self.api))
			);
		}
	}

	window.SignInPage = SignInPage;
})();
