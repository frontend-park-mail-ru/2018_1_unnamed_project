'use strict';

define('SigninPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const User = require('User');
    const ValidatorFactory = require('ValidatorFactory');

    const bus = require('bus');

    const Form = require('Form');
    const FormEvents = require('Form/events');

    /**
     * Страница входа.
     */
    return class SigninPage extends Page {
        /**
         *
         */
        constructor() {
            super(signinPageTemplate);

            this.attrs = {
                fields: [
                    {
                        type: 'email',
                        name: 'email',
                        placeholder: 'Email',
                        validator: ValidatorFactory.buildEmailValidator(),
                    },
                    {
                        type: 'password',
                        name: 'password',
                        placeholder: 'Пароль',
                        validator: ValidatorFactory.buildPasswordValidator(),
                    },
                ],
                formFooterLink: {
                    title: 'Нет аккаунта? Зарегистрируйтесь!',
                    href: '/signup',
                },
                resetText: 'Очистить',
                submitText: 'Вход',
            };

            this._formRoot = null;
            this._form = null;

            bus.on(FormEvents.FORM_DATA_SUBMITTED, ({data, errors}) => {
                if (!this.active) return;

                const push = new Push();
                push.clear();

                if (errors) {
                    errors.forEach((e) => {
                        push.addMessage(e);
                        console.log(e);
                    });
                    push.render({level: PushLevels.MSG_ERROR});
                    return;
                }

                User.signIn(data);
            });
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {SigninPage}
         */
        create(attrs) {
            super.create(this.attrs);

            this._formRoot = this.element.querySelector('.js-signin-form-root');
            this._form = new Form({element: this._formRoot, attrs: this.attrs});

            return this;
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.NOT_LOGGED_IN_USER;
        }
    };
});
