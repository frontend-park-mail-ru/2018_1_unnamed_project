'use strict';

define('SettingsPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const User = require('User');
    const UserEvents = require('User/events');
    const ValidatorFactory = require('ValidatorFactory');

    const bus = require('bus');

    const Form = require('Form');
    const FormEvents = require('Form/events');

    /**
     * Страница настроект пользователя.
     */
    return class SettingsPage extends Page {
        /**
         *
         */
        constructor() {
            super(settingsPageTemplate);

            this.setFormDataSubmittedHandler()
                .setCurrentUserChangedHandler();
        }

        /**
         * @private
         * @return {SettingsPage}
         */
        setFormDataSubmittedHandler() {
            bus.on(FormEvents.FORM_DATA_SUBMITTED, ({data, errors}) => {
                if (!this.active) return;

                const push = new Push();
                push.clear();

                const notEmptyFieldsCount = Object.values(data).filter((element) => element !== '').length;

                if (notEmptyFieldsCount === 0 && !errors) {
                    push.addMessage('Поля формы пусты');
                    push.render({level: PushLevels.MSG_WARNING});
                    return;
                }

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

                console.log(Object.keys(data).forEach((key) => {
                    (!data[key] && data[key] !== undefined) && delete data[key];
                }));

                User.update(data);
            });

            return this;
        }

        /**
         * @private
         * @return {SettingsPage}
         */
        setCurrentUserChangedHandler() {
            bus.on(UserEvents.CURRENT_USER_CHANGED, (newUser) => {
                if (!this.active || !newUser) return;

                const renderAttr = Object.assign({}, this.attrs, newUser);
                this.render(renderAttr);
            });

            return this;
        }

        /**
         * @private
         * @return {SettingsPage}
         */
        setAvatarHandlers() {
            this._uploadAvatarForm = this.element.querySelector('#upload-avatar');
            this._uploadAvatarForm.addEventListener('change', (evt) => {
                evt.preventDefault();
                const form = evt.currentTarget;
                User.changeAvatar(form);
            });

            this._deleteAvatarButton = this.element.querySelector('#delete-avatar');
            this._deleteAvatarButton.addEventListener('click', (evt) => {
                evt.preventDefault();
                User.deleteAvatar();
            });

            return this;
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {Page}
         */
        render(attrs) {
            // Перенесено в render, чтобы отрисовать изменения плейсходлеров при
            // изменении пользователя.
            const renderAttrs = this.constructRenderAttrs(attrs);
            super.render(renderAttrs);

            this._formRoot = this.element.querySelector('.js-settings-form-root');
            this._form = new Form({element: this._formRoot, attrs: this.attrs});

            this.setAvatarHandlers();

            return this;
        }

        /**
         * Заполняет массив атрибутов для отрисовки страницы.
         * @param {Object} attrs
         * @return {SettingsPage}
         */
        constructRenderAttrs(attrs) {
            const currentUser = User.currentUser;

            if (currentUser) {
                this.attrs = {
                    fields: [
                        {
                            type: 'text',
                            name: 'username',
                            placeholder: currentUser.username,
                            validator: ValidatorFactory.buildUsernameNonMandatoryValidator(),
                        },
                        {
                            type: 'email',
                            name: 'email',
                            placeholder: currentUser.email,
                            validator: ValidatorFactory.buildEmailNonMandatoryValidator(),
                        },
                        {
                            type: 'password',
                            name: 'password',
                            placeholder: 'Пароль',
                            validator: ValidatorFactory.buildPasswordNonMandatoryValidator(),
                        },
                        {
                            type: 'password',
                            name: 'password-confirmation',
                            placeholder: 'Подтверждение пароля',
                            validator: ValidatorFactory.buildPasswordConfirmationNonMandatoryValidator(),
                        },
                    ],
                    resetText: 'Очистить',
                    submitText: 'Обновить',
                };
            } else {
                this.attrs = {};
            }

            return Object.assign({}, this.attrs, currentUser);
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.LOGGED_IN_USER;
        }
    };
});
