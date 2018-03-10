'use strict';

(function () {

	class AuthFormsBuilder extends window.AbstractBuilder {

		constructor(nodeName = null) {
			super();

			this._nodeName = nodeName;
			this._upin = this.node.className.slice(7, 9);
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

		get node() {
			return document.getElementsByClassName(this._nodeName)[0];
		}

		checkAuth(buildMultiplayer = false) {
			const profileBar = window.Application.profileBar;
			const push = window.Application.push;
			const router = window.Application.router;

			this.api.getMe()
				.then(response => {
					profileBar.innerText = response.username;
					profileBar.setAttribute('data-section', 'profile');
					if (buildMultiplayer) {
						push.data = `Welcome back, ${response.username}`;
						push.render('success');
						router.navigateTo('multiplayer');
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

			const push = window.Application.push;

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

			// Делаем сообщения об ошибках неповторяющимися.
			const data = [... new Set(push.data)];
			push.clear();

			for (let i = 0; i < data.length; ++i) {
				push.data = data[i];
			}

			if (push.data.length > 0) {
				push.render('error');
				return;
			}

			const profileBuilder = window.Application.profilePage.builder;

			const router = window.Router;

			callback(formData)
				.then(() => {
					this.checkAuth(true);
					router.navigateTo('profile');
					profileBuilder.updateBar();
				})
				.catch(errors => {
					errors.forEach(error => push.data = error);
					push.render('error');
				})
		}

		logoutMe() {
			const multiplayerBuilder = window.Application.multiplayerPage.builder;
			const profileBuilder = window.Application.profilePage.builder;

			const router = window.Router;

			this.api.logout()
				.then(() => {
					router.navigateTo('menu');
					profileBuilder.updateBar();
					multiplayerBuilder.clear();
				})
				.catch(error => {
					console.log(error);
				});
		}

		render() {
			if (!this.node) return;
			this.node.innerHTML = `
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
                        ${ (!this._signup ? `
                        <td class="su-td">
                            <div class="signup">
                                <a href="#" data-section="signup" class="js-signup-form bordered">Register</a>
                            </div>
                        </td>
                        <td class="space"></td>
                        ` : '')
						}
                        
                        <td class="si-td">
                            <input required type="submit" class="bordered js-sign${this._upin}-form" 
                            value="${this._upin === 'up' ? 'Register' : 'Signin'}">
                        </td>
                    </tr>
                </table>
            `;
		}
	}

	window.AuthFormsBuilder = AuthFormsBuilder;
})();
