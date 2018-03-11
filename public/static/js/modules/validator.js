(function () {
    /**
     * Validate fields for signin/signup/setting
     */
    class Validator {
        /**
         *
         */
        constructor() {
            this.validators = {
                username: {
                    regex: /^([a-zA-Z0-9]{7,})+$/,
                    desc: 'minimum lenght is 7, only digits and english symbols are allowed',
                },
                password: {
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    desc: 'minimum lenght is 6, only english symbols and at least one digit',
                },
                password_confirmation: {
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    desc: 'minimum lenght is 6, only english symbols and at least one digit',
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
         * @param {bool} fromSettings (default: false)
         * @return {Object}
         */
        validateCredentials(form, push, fromSettings = false) {
            const errors = [];
            const formData = {};
            Object.values(form.elements).forEach((field) => {
                let validator = this.validators[field.name];
                if (validator) {
                    if (field.value.match(validator.regex)) {
                        formData[field.name] = field.value;
                    } else if (!((field.value === '') && fromSettings)) {
                        errors.push(`${field.name} ${validator.desc}`);
                    }
                }
            });

            if (fromSettings) {
                if (('password' in formData && !('password_confirmation' in formData)) ||
                    ('password_confirmation' in formData && !('password' in formData))) {
                    errors.push('Passwords don\'t match');
                }
            };

            if ('password_confirmation' in formData &&
                        formData['password'] !== formData['password_confirmation']) {
                errors.push('Passwords don\'t match');
            };

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
    }

    window.Validator = Validator;
})();