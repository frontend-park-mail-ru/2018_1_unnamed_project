'use strict';

(function () {

	// const BACKEND_URI = 'http://localhost:8080'; // debug
	const BACKEND_URI = 'https://dev-api-shipcollision.herokuapp.com'; // production

	class API {

		constructor(httpModule = window.HttpModule) {
			this.httpModule = httpModule;
			// noinspection SpellCheckingInspection
			this.routeMappings = {
				'me': BACKEND_URI + '/me',
				'signIn': BACKEND_URI + '/signin',
				'signUp': BACKEND_URI + '/signup',
				'logout': BACKEND_URI + '/signout',
				'scoreboard': BACKEND_URI + '/users/scoreboard',
				'avatar': BACKEND_URI + '/me/avatar'
			};
		}

		// noinspection JSMethodCanBeStatic
		get backendURI() {
			return BACKEND_URI;
		}

		getMe() {
			return this.httpModule.doGet({
				url: this.routeMappings.me
			});
		}

		signIn(data) {
			return this.httpModule.doPost({
				url: this.routeMappings.signIn,
				data
			});
		}

		signUp(data) {
			return self.httpModule.doPost({
				url: this.routeMappings.signUp,
				data
			});
		}

		logout() {
			return this.httpModule.doDelete({
				url: this.routeMappings.logout
			});
		}

		scoreboard() {
			return this.httpModule.doGet({
				url: this.routeMappings.scoreboard
			});
		}

		uploadAvatar(data) {
			/**
			 * Content-Type выставляется в null для того, чтобы
			 * браузер сам коректно выставил boundaries для multipart/form-data.
			 */
			return this.httpModule.doPost({
				url: this.routeMappings.avatar,
				contentType: null,
				data
			});
		}

		deleteAvatar() {
			return this.httpModule.doDelete({
				url: this.routeMappings.avatar
			});
		}
	}

	window.API = API;
})();