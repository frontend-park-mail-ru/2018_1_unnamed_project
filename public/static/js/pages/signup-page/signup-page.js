'use strict';

(function () {

	class SignUpPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'signup'} = {}) {
			super({parentId, pageId});
			this.parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <form class="js-signup-form" novalidate></form>
		    </section>
			`;
			this._builder = new window.AuthFormsBuilder('js-signup-form');
		}

		show() {
			super.show();
			this._builder.render();

			const self = this;
			this._builder.node.addEventListener(
				'submit',
				() => self.builder.onSubmitAuthForm(event, self.api.signUp.bind(self.api))
			);
		}
	}

	window.SignUpPage = SignUpPage;
})();
