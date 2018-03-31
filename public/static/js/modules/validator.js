'use strict';

// noinspection JSUnusedLocalSymbols
define('validator', (require) => {
    /**
     * Валидатор для форм логина/логаута/настроек.
     */
    return class Validator {
        /**
         *
         */
        constructor() {
            this.validators = {
                username: {
                    regex: /^([a-zA-Z0-9]{7,})+$/,
                    desc: 'minimum length is 7, only digits and english symbols are allowed',
                },
                password: {
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    desc: 'minimum length is 6, only english symbols and at least one digit',
                },
                password_confirmation: {
                    regex: /.+/,
                    desc: 'minimum length is 6, only english symbols and at least one digit',
                },
                email: {
                    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                    desc: 'должен быть email-ом, а ты пашол вон',
                },
            };
        }

        /**
         * @param {*} form
         * @param {*} push
         * @param {boolean} confirmationNeeded (default: false)
         * @param {string} action
         * @return {Object}
         */
        validateCredentials(form, push, confirmationNeeded = false, action = '') {
            const errors = [];
            const formData = {};
            Object.values(form.elements).forEach((field) => {
                let validator = this.validators[field.name];
                if (validator) {
                    if (field.value.match(validator.regex)) {
                        formData[field.name] = field.value;
                    } else if (!((field.value === '') && action === 'update')) {
                        errors.push(`${field.name} ${validator.desc}`);
                    }
                }
            });

            switch (true) {
            case confirmationNeeded && formData['password'] && !formData['password_confirmation']:
            case formData['password_confirmation'] && formData['password'] !== formData['password_confirmation']:
                errors.push('Passwords don\'t match');
                break;
            default:
                break;
            }

            push.clear();
            if (errors.length) {
                const data = [...new Set(errors)];
                data.forEach((errorMessage) => push.data = errorMessage);
                push.render('error');
                return {
                    err: true,
                    formData: null,
                };
            } else if (Object.keys(formData).length) {
                return {
                    err: false,
                    formData,
                };
            } else {
                push.data = 'Fields are empty';
                push.render('warning');
                return {
                    err: true,
                    formData: null,
                };
            }
        }
    };
});
