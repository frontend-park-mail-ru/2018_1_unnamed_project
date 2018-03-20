'use strict';

(function() {
    const AbstractPage = window.AbstractPage;
    /**
     * Страница входа.
     */
    class SignInPage extends AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'signin'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', signinPageTemplate({pageId}));
            this._builder = new window.AuthFormsBuilder('js-signin-form');

            this.signinSubmit = () => this.builder.onSubmitAuthForm(event, this.api.signIn.bind(this.api));
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            this.builder.render();

            const generatedSignUpHref = document.getElementsByClassName('js-signup-form__submit-button')[0];
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
