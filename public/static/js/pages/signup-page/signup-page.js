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

            this.parentNode.insertAdjacentHTML('beforeend', signupPageTemplate({pageId}));
            // this.parentNode.innerHTML += `
            // <section id="${pageId}" hidden>
            //     <form class="js-signup-form" novalidate></form>
            // </section>
            // `;
            this._builder = new window.AuthFormsBuilder('js-signup-form');
        }

        /**
         * Отображает страницу.
         */
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
