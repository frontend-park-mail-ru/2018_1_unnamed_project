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

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', signinPageTemplate({pageId}));
            this._builder = new window.AuthFormsBuilder('js-signin-form');
            const self = this;
            this.signinSubmit = () => self.builder.onSubmitAuthForm(event, self.api.signIn.bind(self.api));
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            this.builder.render();

            const generatedSignUpHref = document.getElementsByClassName('signup')[0];
            generatedSignUpHref.addEventListener('click', window.anchorSubmitListener);

            const node = this.builder.node;

            node.removeEventListener(
                'submit',
                this.signinSubmit
            );
            node.reset();
            node.addEventListener(
                'submit',
                this.signinSubmit
            );
        }
    }

    window.SignInPage = SignInPage;
})();
