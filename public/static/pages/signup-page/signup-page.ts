import {Form} from '../../components/form/form';
import {Loader} from "../../components/loader/loader";
import {PushLevels} from '../../components/message-container';
import {User} from '../../models/user';
import {ValidatorFactory} from '../../modules/validator-factory';
import {Page, PageAccessTypes} from '../page';
import signupPageTemplate from './signup-page.pug';

export class SignupPage extends Page {
    private _formRoot;
    private _form;

    /**
     *
     */
    constructor() {
        super(signupPageTemplate);

        this.attrs = SignupPage.defaultAttrs;
    }

    /**
     *
     */
    static get defaultAttrs() {
        return {
            fields: [
                {
                    type: 'text',
                    name: 'username',
                    placeholder: 'Имя пользователя',
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
                question: 'Уже есть аккаунт?',
                title: 'Войдите!',
                href: '/signin',
            },
            resetText: 'Очистить',
            submitText: 'Регистрация',
        };
    }

    /**
     * @private
     * @return {SignupPage}
     */
    getFormDataSubmittedHandler() {
        return ({data, errors}) => {
            if (!this.active) return;

            const loader = new Loader();

            this.push.clear();

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
                loader.hide();
                this.push.render({level: PushLevels.Error});
                return;
            }

            User.signUp(data);
        };
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {SignupPage}
     */
    render(attrs) {
        super.render(attrs);

        this._formRoot = this.element.querySelector('.js-signup-form-root');
        this._form = new Form({
            element: this._formRoot,
            callback: this.getFormDataSubmittedHandler(),
            attrs: this.attrs,
        });

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
