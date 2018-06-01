import {Form} from '../../components/form/form';
import {PushLevels} from '../../components/message-container';
import {User} from '../../models/user';
import {ValidatorFactory} from '../../modules/validator-factory';
import {Page, PageAccessTypes} from '../page';
import signinPageTemplate from './signin-page.pug';

export class SigninPage extends Page {
    private _formRoot;
    private _form;

    /**
     *
     */
    constructor() {
        super(signinPageTemplate);

        this.attrs = SigninPage.defaultAttrs;
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
                question: 'Нет аккаунта?',
                title: 'Зарегистрируйтесь!',
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
    getFormDataSubmittedHandler() {
        return ({data, errors}) => {
            if (!this.active) return;

            this.push.clear();

            if (errors) {
                errors.forEach((e) => {
                    this.push.addMessage(e);
                });
                this.push.render({level: PushLevels.Error});
                return;
            }

            User.signIn(data);
        };
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {SigninPage}
     */
    render(attrs) {
        super.render(attrs);

        this._formRoot = this.element.querySelector('.js-signin-form-root');
        this._form = new Form({
            element: this._formRoot,
            callback: this.getFormDataSubmittedHandler(),
            attrs: this.attrs,
        });

        this.push.renderShared({level: PushLevels.Error});

        this.profileBar.hide();

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
