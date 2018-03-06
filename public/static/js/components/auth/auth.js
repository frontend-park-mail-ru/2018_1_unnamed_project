(function () {

    class AuthFormsBuilder extends window.AbstractBuilder {

        constructor(node = {}) {
            super();
            this._node = node;
        }

        checkAuth(buildMultiplayer = false) {
            api.loadMe()
                .then(response => {           
                    if (buildMultiplayer) {
                        openSection('multiplayer');
                        push.data = `Welcome back, ${response.username}`;
                        push.render('success');
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

        onSubmitAuthForm(event, func, buildOnSuccess) {
            event.preventDefault();
            const form = event.currentTarget;
            const formElements = form.elements;

            const formdata = {};

            Object.values(form.elements).forEach((field) => {
                if (field.type !== 'submit') {
                    formdata[field.name] = field.value;
                }
            });

            func(formdata)
                .then(response => {
                    this.checkAuth(true);
                })
                .catch(errors => {
                    debugger;
                    errors.forEach(error => push.data = error);
                    push.render('error');
                })
        }

        render() {
            if (!(this._node)) {
                return;
            }
            const inorup = this._node.className.slice(7, 9);
            this._node.innerHTML = `
                <input required class="auth-form__input" type="email" name="email" placeholder="email">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
                    ((inorup === 'up') ? `
                    <input required class="auth-form__input" type="password" name="password_confirmation\" placeholder="password again">
                    <input required class="auth-form__input" type="text" name="username" placeholder="username">
                    ` : '')
                }
                <table class="form-buttons">
                    <tr>
                        <td class="si-td">
                            <input required type="submit" class="bordered js-sign${inorup}-form" value="Sign ${inorup}">
                        </td>
                        ${ ((inorup === 'in') ? `
                        <td class="space"></td>
                        <td class="su-td">
                            <div class="signup">
                                <a href="#" data-section="signup" class="js-signup-form bordered">Sign up</a>
                            </div>
                        </td>
                        ` : '')
                        }
                    </tr>
                </table>
            `
        }
    }

    window.AuthFormsBuilder = AuthFormsBuilder;

})();