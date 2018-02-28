(function () {

    const noop = () => null;

    class AuthFormsBuilder {
        constructor(form = noop) {
            this._node = form
        }

        render() {
            const inorup = this._node.className.slice(7,9);
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
                        <td>
                            <input required type="submit" class="auth-form__input js-sign${inorup}-form" value="Sign ${inorup}">
                        </td>
                        ${ ((inorup === 'in') ? `
                        <td>
                            <div class="orsignup">
                                <b class="or">or</b>
                                <a href="#" class="signup" data-section="signup">Sign up</a>
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