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
                    regex: /.*/,
                    desc: 'meh',
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
         * @return {Object}
         */
        validateCredentials(form, push) {
            debugger;
            const errors = [];
            const formData = {};
            Object.values(form.elements).forEach((field) => {
                let validator = this.validators[field.name];
                if (validator) {
                    if (!field.value.match(validator.regex)) {
                        errors.push(`${field.name} ${validator.desc}`);
                    } else {
                        formData[field.name] = field.value;
                    }
                }
            });

            if ('password_confirmation' in formData && formData['password'] !== formData['password_confirmation']) {
                errors.push('Passwords don\'t match');
            };

            if (errors.length > 0) {
                const data = [...new Set(errors)];
                data.forEach((errorMessage) => push.data = errorMessage);
                push.render('error');
                return {
                    err: true,
                    formData: null,
                };
            } else {
                return {
                    err: false,
                    formData,
                };
            };
        }
    }

    window.Validator = Validator;
})();
