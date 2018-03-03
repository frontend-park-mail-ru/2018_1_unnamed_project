(function () {

    class AuthFormsBuilder extends window.AbstractBuilder {

        constructor(node = {}) {
            super();
            this._node = node;
        }

        checkAuth(fromMultiplayer = false) {
            debugger;
            api.loadMe((err, me) => {
                if (err) {
                    profile.children[0].textContent = "Unauthorized";
                } else {
                    profile.children[0].textContent = me.username;
                    profile.children[0].attrs['data-section'] = 'profile';

                    if (fromMultiplayer) {
                        openSection('realMultiplayer')
                        push.data = response.desc;
                        push.render('success');
                    }
                }
            });
        }

        onSubmitAuthForm(event, func) {
            event.preventDefault();
            const form = event.currentTarget;
            const formElements = form.elements;

            const formdata = {};

            Object.values(form.elements).forEach((field) => {
                if (field.type !== 'submit') {
                    formdata[field.name] = field.value;
                }
            });

            func(formdata, function (err, response) {
                push.clear();
                if (err) {
                    push.data = JSON.parse(err.response).desc;
                    push.render('error');
                    return;
                }

                checkAuth(true);

                window.profileBuilder.setProfile
            });
        }

        render() {
            if (!(this._node)) {
                return;
            }
            const inorup = this._node.className.slice(7, 9);
            this._node.innerHTML = `
                <input required class="auth-form__input" type="text" name="username" placeholder="username">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
                    ((inorup === 'up') ? `
                    <input required class="auth-form__input" type="password" name="password_confirmation\" placeholder="password again">
                    <input required class="auth-form__input" type="email" name="email" placeholder="email">
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