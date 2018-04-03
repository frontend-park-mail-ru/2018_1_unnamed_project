'use strict';

define('SignupPage', (require) => {
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
     * Страница регистрации.
     */
    return class SignupPage extends Page {
        /**
         *
         */
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
                        validator: ValidatorFactory.buildPasswordValidator(),
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

                const push = new Push();
                push.clear();

                if (data['password'] !== data['password-confirmation']) {
                    errors = errors || [];
                    errors.push('Пароль и подтверждение не совпадают');
                    push.addMessage('Пароль и подтверждение не совпадают');
                }

                if (errors) {
                    errors.forEach((err) => {
                        push.addMessage(err);
                        console.log(err);
                    });
                    push.render({level: PushLevels.MSG_ERROR});
                    return;
                }

                User.signUp(data);
            });
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {SignupPage}
         */
        create(attrs) {
            super.create(this.attrs);

            this._formRoot = this.element.querySelector('.js-signup-form-root');
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
