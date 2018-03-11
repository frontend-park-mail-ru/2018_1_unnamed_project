'use strict';

(function() {
    /**
     * Страница входа.
     */
    class SignInPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'signin'} = {}) {
            super({parentId, pageId});
            this.parentNode.innerHTML += `
            <section id="${pageId}" hidden>
                <form class="js-signin-form" novalidate></form>
            </section>
            `;
            this._builder = new window.AuthFormsBuilder('js-signin-form');
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            this._builder.render();

            const generatedSignUpHref = document.getElementsByClassName('signup')[0];
            generatedSignUpHref.addEventListener('click', window.anchorSubmitListener);

            const self = this;
            this._builder.node.addEventListener(
                'submit',
                () => self.builder.onSubmitAuthForm(event, self.api.signIn.bind(self.api))
            );
        }
    }

    window.SignInPage = SignInPage;
})();
