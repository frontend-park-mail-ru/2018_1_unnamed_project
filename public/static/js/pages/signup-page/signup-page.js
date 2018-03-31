'use strict';

define('SignupPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const User = require('User');
    const ValidatorFactory = require('ValidatorFactory');

    const bus = require('bus');

    const Form = require('Form');
    const FormEvents = require('Form/events');

    return class SignupPage extends Page {
        constructor() {
            super(signupPageTemplate);

            this.attrs = {
                fields: [
                    {
                        type: 'text',
                        name: 'username',
                        placeholder: 'Username',
                        validator: ValidatorFactory.buildUsernameValidator(),
                    },
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
                        validator: ValidatorFactory.buildPasswordValiator(),
                    },
                    {
                        type: 'password',
                        name: 'password-confirmation',
                        placeholder: 'Подтверждение пароля',
                        validator: ValidatorFactory.buildPasswordConfirmationValidator(),
                    },
                ],
                formFooterLink: {
                    title: 'Уже есть аккаунт? Войдите!',
                    href: '/signin',
                },
                resetText: 'Очистить',
                submitText: 'Регистрация',
            };

            this._formRoot = null;
            this._form = null;

            bus.on(FormEvents.FORM_DATA_SUBMITTED, ({data, errors}) => {
                if (!this.active) return;

                if (errors) {
                    errors.forEach((err) => console.log(err));
                    return;
                }

                User.signUp(data);
            });
        }

        create() {
            super.create(this.attrs);

            this._formRoot = this.element.querySelector('.js-signup-form-root');
            this._form = new Form({element: this._formRoot, attrs: this.attrs});

            return this;
        }

        accessType() {
            return AccessTypes.NOT_LOGGED_IN_USER;
        }
    };
});
