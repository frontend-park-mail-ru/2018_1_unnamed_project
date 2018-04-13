import {Form, FormEvents} from "../../components/form/form";
import {PushLevels} from "../../components/push/push";
import {User} from "../../models/user";
import bus from "../../modules/bus";
import {ValidatorFactory} from "../../modules/validator-factory";
import {Page, PageAccessTypes} from "../page";
import signinPageTemplate from "./signin-page.pug";

import "./signin-page.css";

export class SigninPage extends Page {
    private _formRoot;
    private _form;

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
            fields:         [
                {
                    type:        'email',
                    name:        'email',
                    placeholder: 'Email',
                    validator:   ValidatorFactory.buildEmailValidator(),
                },
                {
                    type:        'password',
                    name:        'password',
                    placeholder: 'Пароль',
                    validator:   ValidatorFactory.buildPasswordValidator(),
                },
            ],
            formFooterLink: {
                title: 'Нет аккаунта? Зарегистрируйтесь!',
                href:  '/signup',
            },
            resetText:      'Очистить',
            submitText:     'Вход',
        };
    }

    /**
     * @private
     * @return {SigninPage}
     */
    setFormDataSubmittedHandler() {
        bus.on(FormEvents.FormDataSubmitted, ({data, errors}) => {
            if (!this.active) return;

            this.push.clear();

            if (errors) {
                errors.forEach((e) => {
                    this.push.addMessage(e);
                    console.log(e);
                });
                this.push.render({level: PushLevels.Error});
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

        this.push.renderShared({level: PushLevels.Error});

        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.NotLoggedInUser;
    }
}
