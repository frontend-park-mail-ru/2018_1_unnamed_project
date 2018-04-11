import {Form, FormEvents} from "../../components/form/form";
import {PushLevels} from "../../components/push/push";
import {User, UserEvents} from "../../models/user";
import bus from "../../modules/bus";
import {ValidatorFactory} from "../../modules/validator-factory";
import {Page, PageAccessTypes} from "../page";
import settingsPageTemplate from "./settings-page.pug";

import "./settings-page.css";

export class SettingsPage extends Page {
    private _deleteAvatarButton;
    private _uploadAvatarForm;

    private _formRoot;
    private _form;

    /**
     *
     */
    constructor() {
        super(settingsPageTemplate);

        this
            .setFormDataSubmittedHandler()
            .setCurrentUserChangedHandler();
    }

    /**
     * @private
     * @return {SettingsPage}
     */
    setFormDataSubmittedHandler() {
        bus.on(FormEvents.FormDataSubmitted, ({data, errors}) => {
            if (!this.active) return;

            this.push.clear();

            const notEmptyFieldsCount = Object.values(data).filter((element) => element !== '').length;

            if (notEmptyFieldsCount === 0 && !errors) {
                this.push.addMessage('Поля формы пусты');
                this.push.render({level: PushLevels.Warning});
                return;
            }

            if ((data as any).password !== data['password-confirmation']) {
                errors = errors || [];
                errors.push('Пароль и подтверждение не совпадают');
                this.push.addMessage('Пароль и подтверждение не совпадают');
            }

            if (errors) {
                errors.forEach((err) => {
                    this.push.addMessage(err);
                    console.log(err);
                });
                this.push.render({level: PushLevels.Error});
                return;
            }

            console.log(Object.keys(data).forEach((key) => {
                return (!data[key] && data[key] !== undefined) && delete data[key];
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
        bus.on(UserEvents.CurrentUserChanged, (newUser) => {
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
                fields:     [
                    {
                        type:        'text',
                        name:        'username',
                        placeholder: currentUser.username,
                        validator:   ValidatorFactory.buildUsernameOptionalValidator(),
                    },
                    {
                        type:        'email',
                        name:        'email',
                        placeholder: currentUser.email,
                        validator:   ValidatorFactory.buildEmailOptionalValidator(),
                    },
                    {
                        type:        'password',
                        name:        'password',
                        placeholder: 'Пароль',
                        validator:   ValidatorFactory.buildPasswordOptionalValidator(),
                    },
                    {
                        type:        'password',
                        name:        'password-confirmation',
                        placeholder: 'Подтверждение пароля',
                        validator:   ValidatorFactory.buildPasswordConfirmationOptionalValidator(),
                    },
                ],
                resetText:  'Очистить',
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
        return PageAccessTypes.LoggedInUser;
    }
}
