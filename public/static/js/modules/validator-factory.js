'use strict';

// noinspection JSUnusedLocalSymbols
define('ValidatorFactory', (require) => {
    const validators = {
        username: {
            regex: /^([a-zA-Z0-9]{7,})+$/,
            desc: 'minimum length is 7, only digits and english symbols are allowed',
        },
        password: {
            regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
            desc: 'minimum length is 6, only english symbols and at least one digit',
        },
        passwordConfirmation: {
            regex: /.+/,
            desc: 'minimum length is 6, only english symbols and at least one digit',
        },
        email: {
            regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
            desc: 'должен быть email-ом, а ты пашол вон',
        },
    };

    /**
     * Валидатор полей формы.
     */
    class Validator {
        /**
         * @param {RegExp}  regex
         * @param {string} desc
         */
        constructor({regex, desc}) {
            this._regex = regex;
            this._desc = desc;

            this._lastError = null;
        }

        /**
         * @return {string|null}
         */
        get lastError() {
            return this._lastError;
        }

        /**
         * @param {string} value
         * @return {boolean}
         */
        validate(value) {
            if (value.match(this._regex)) {
                this._lastError = null;
                return true;
            } else {
                this._lastError = this._desc;
                return false;
            }
        }
    }

    /**
     * Валидатор, допускающий пустые поля.
     */
    class NonMandatoryValidator extends Validator {
        /**
         * @param {string} value
         * @override
         */
        validate(value) {
            if (!value || value === '') {
                return true;
            }
            return super.validate(value);
        }
    }

    /**
     * Фабрика валидаторов.
     */
    return class ValidatorFactory {
        /**
         * @return {Validator}
         */
        static buildUsernameValidator() {
            return new Validator(validators.username);
        }

        /**
         * @return {NonMandatoryValidator}
         */
        static buildUsernameNonMandatoryValidator() {
            return new NonMandatoryValidator(validators.username);
        }

        /**
         * @return {Validator}
         */
        static buildPasswordValidator() {
            return new Validator(validators.password);
        }

        /**
         * @return {NonMandatoryValidator}
         */
        static buildPasswordNonMandatoryValidator() {
            return new NonMandatoryValidator(validators.password);
        }

        /**
         * @return {Validator}
         */
        static buildPasswordConfirmationValidator() {
            return new Validator(validators.passwordConfirmation);
        }

        /**
         * @return {NonMandatoryValidator}
         */
        static buildPasswordConfirmationNonMandatoryValidator() {
            return new NonMandatoryValidator(validators.passwordConfirmation);
        }

        /**
         * @return {Validator}
         */
        static buildEmailValidator() {
            return new Validator(validators.email);
        }

        static buildEmailNonMandatoryValidator() {
            return new NonMandatoryValidator(validators.email);
        }
    };
});
