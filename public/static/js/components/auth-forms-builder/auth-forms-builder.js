'use strict';

(function () {

	class AuthFormsBuilder extends window.AbstractBuilder {

		constructor(node = {}) {
			super();

			this._node = node;

			this._upin = this._node.className.slice(7, 9);
			this._signup = this._upin === 'up';

			this.validators = {
				username: {
					regex: /^([a-zA-Z0-9]{7,})+$/,
					desc: "minimum length is 7, only digits and english symbols are allowed"
				},
				password: {
					regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
					desc: "minimum length is 6, only english symbols and at least one digit"

				},
				password_confirmation: {
					regex: /.*/,
					desc: "meh"
				},
				email: {
					regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
					desc: "должен быть email-ом, а ты пашол вон"
				}
			};
		}

		checkAuth(buildMultiplayer = false) {
			api.getMe()
				.then(response => {
					profileBar.innerText = response.username;
					profileBar.setAttribute('data-section', 'profile');
					if (buildMultiplayer) {
						openSection('multiplayer');
						push.data = `Welcome back, ${response.username}`;
						// noinspection ES6ModulesDependencies
						push.render('success');
					}
				})
				.catch(error => {
					profileBar.innerText = 'Unauthorised';
					profileBar.setAttribute('data-section', 'signin');
					console.log(error);
				});
		}

		onSubmitAuthForm(event, callback) {
			event.preventDefault();
			const form = event.currentTarget;
			const formData = {};

			Object.values(form.elements).forEach((field) => {
				if (field.type !== 'submit') {
					formData[field.name] = field.value;

					let validator = this.validators[field.name];

					if (validator && !field.value.match(validator.regex)) {
						push.data = `${field.name} ${validator.desc}`;
					}
				}
			});

			if ('password_confirmation' in formData && formData['password'] !== formData['password_confirmation'])
				push.data = 'Passwords don\'t match';

			if (push.data.length > 0) {
				// noinspection ES6ModulesDependencies
				push.render('error');
				return;
			}

			callback(formData)
				.then(() => {
					this.checkAuth(true);
					profileBuilder.updateBar();
				})
				.catch(errors => {
					errors.forEach(error => push.data = error);
					// noinspection ES6ModulesDependencies
					push.render('error');
				})
		}

		logoutMe() {
			api.logout()
				.then(() => {
					profileBuilder.updateBar();
					multiplayerBuilder.clear();
					window.openSection('menu');
				})
				.catch(error => {
					console.log(error);
				});
		}

		render() {
			if (!this._node) return;
			this._node.innerHTML = `
                <input required class="auth-form__input" type="email" name="email" placeholder="email">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
				(this._signup ? `
                    <input required class="auth-form__input" type="password" name="password_confirmation\" placeholder="password again">
                    <input required class="auth-form__input" type="text" name="username" placeholder="username">
                    ` : '')
				}
                <table class="form-buttons">
                    <tr>
                        <td class="si-td">
                            <input required type="submit" class="bordered js-sign${this._upin}-form" value="Sign ${this._upin}">
                        </td>
                        ${ (!this._signup ? `
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
