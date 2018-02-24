(function () {

    const noop = () => null;

    class AuthFormsBuilder {
        constructor(form = noop) {
            this._node = form
        }

        render() {
            this._node.innerHTML = `
                <input required class="auth-form__input" type="text" name="username" placeholder="username">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
                    ((this._node.className === 'js-signup-form') ? `
                    <input required class="auth-form__input" type="password" name="password_confirmation\" placeholder="password again">
                    <input required class="auth-form__input" type="email" name="email" placeholder="email">
                    ` : '')
                }
                <input required type="submit" class="auth-form__input ${this._node.className}" placeholder="Submit">
            `
        }
    }

    window.AuthFormsBuilder = AuthFormsBuilder;

})();