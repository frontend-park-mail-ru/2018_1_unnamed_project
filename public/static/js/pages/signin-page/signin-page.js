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

            this.attrs = SigninPage.defaultAttrs;

            this.setFormDataSubmittedHandler();
        }

        /**
         * Возвращает атрибуты по умолчанию.
         * @return {{fields: *[], formFooterLink: {title: string, href: string}, resetText: string, submitText: string}}
         */
        static get defaultAttrs() {
            return {
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
        }

        /**
         * @private
         * @return {SigninPage}
         */
        setFormDataSubmittedHandler() {
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

            return this;
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {SigninPage}
         */
        render(attrs) {
            super.render(attrs);

            this._formRoot = this.element.querySelector('.js-signin-form-root');
            this._form = new Form({element: this._formRoot, attrs: this.attrs});

            const push = new Push();
            push.renderShared({level: PushLevels.MSG_ERROR});

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
