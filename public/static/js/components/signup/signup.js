(function () {

    const noop = () => null;

    class AuthFormsBuilder {
        constructor(form = noop) {
            this._node = form
        }

        render() {
            debugger;
            this._node.innerHTML = `
                <input required class="auth-form__input" type="text" name="username" placeholder="username">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
                    ((this._node.className === 'js-signup-form') ? `
                        <input required class="auth-form__input" type="email" name="email" placeholder="email">
                        <input required class="auth-form__input" type="password" name="password2" placeholder="password again">
                    ` : '')
                }
                <input required class="js-signup-submit" type="submit" value="GO">
            `
        }
    }

    window.AuthFormsBuilder = AuthFormsBuilder;

})();