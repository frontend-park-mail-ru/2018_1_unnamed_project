'use strict';

(function() {
    /**
     * Страница регистрации.
     */
    class SignUpPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'signup'} = {}) {
            super({parentId, pageId});

            // noinspection JSUnresolvedFunction
            this.parentNode.insertAdjacentHTML('beforeend', signupPageTemplate({pageId}));
            this._builder = new window.AuthFormsBuilder('js-signup-form');
            const self = this;
            this.signupSubmut = () => self.builder.onSubmitAuthForm(event, self.api.signUp.bind(self.api));
        }

        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            this._builder.render();

            this._builder.node.removeEventListener(
                'submit',
                this.signupSubmut
            );
            this._builder.node.addEventListener(
                'submit',
                this.signupSubmut
            );
        }
    }

    window.SignUpPage = SignUpPage;
})();
