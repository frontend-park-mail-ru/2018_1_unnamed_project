'use strict';

define('SettingsPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const User = require('User');
    const ValidatorFactory = require('ValidatorFactory');

    const bus = require('bus');

    const Form = require('Form');
    const FormEvents = require('Form/events');

    return class SettingsPage extends Page {
        constructor() {
            super(settingsPageTemplate);

            this._formRoot = null;
            this._form = null;

            bus.on(FormEvents.FORM_DATA_SUBMITTED, ({data, errors}) => {
                if (errors) {
                    errors.forEach((err) => console.log(err));
                    return;
                }

                User.update(data);
            });
        }

        create() {
            const currentUser = User.currentUser;

            this.attrs = {
                fields: [
                    {
                        type: 'text',
                        name: 'username',
                        placeholder: currentUser.username,
                        validator: ValidatorFactory.buildUsernameValidator(),
                    },
                    {
                        type: 'email',
                        name: 'email',
                        placeholder: currentUser.email,
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
                        name: 'password_confirmation',
                        placeholder: 'Подтверждение пароля',
                        validator: ValidatorFactory.buildPasswordConfirmationValidator(),
                    },
                ],
                resetText: 'Очистить ввод',
                submitText: 'Войти',
            };

            super.create(this.attrs);

            this._formRoot = this._formRoot || this.element.querySelector('.js-setings-form');
            this._form = new Form(this._formRoot, this.attrs);

            return this;
        }

        accessType() {
            return AccessTypes.LOGGED_IN_USER;
        }
    };
});
