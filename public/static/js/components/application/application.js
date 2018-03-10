'use strict';

(function () {

	let node = document.getElementById('application');
	node.className += ' application';

	node.innerHTML += `
	<div class=msg></div>
	
	<div id="back" class="back" hidden>
        <a href="#" class="back" data-section="menu">back t↺ menu</a>
	</div>
	`;

	node.parentElement.innerHTML = `
	<a href="#" id="bar" class="bar" data-section="profile"></a>
	` + node.parentElement.innerHTML;

	let backRef = document.getElementById('back');

	let profileBar = document.getElementById('bar');

	const push = new window.Push('.msg');

	const menuPage = new window.MenuPage();
	const multiplayerPage = new window.MultiplayerPage();
	const profilePage = new window.ProfilePage();
	const rulesPage = new window.RulesPage();
	const scoreboardPage = new window.ScoreboardPage();
	const signinPage = new window.SignInPage();
	const signupPage = new window.SignUpPage();
	const singleplayerPage = new window.SingleplayerPage();

	let currentPage = null;

	const routes = {};

	class Router {

		static openPage({page, hideBackRef = false}) {
			backRef.hidden = hideBackRef;
			push.clear();

			if (currentPage) {
				currentPage.hide();
			}

			currentPage = page;
			currentPage.show();
		}

		static navigateTo(routeName) {
			if (routeName in routes) {
				routes[routeName].handler();
			}
		}

		static addRoute(name, {re = '', handler = window.noop} = {}) {
			routes[name] = {re, handler};
			return this;
		}
	}

	class Application {

		static get profileBar() {
			if (!profileBar) {
				profileBar = document.getElementById('bar');
			}
			return profileBar;
		}

		static get push() {
			return push;
		}

		static get menuPage() {
			return menuPage;
		}

		static get multiplayerPage() {
			return multiplayerPage;
		}

		static get profilePage() {
			return profilePage;
		}

		static get rulesPage() {
			return rulesPage;
		}

		static get scoreboardPage() {
			return scoreboardPage;
		}

		static get signinPage() {
			return signinPage;
		}

		static get signupPage() {
			return signupPage;
		}

		static get singleplayerPage() {
			return singleplayerPage;
		}

		constructor() {
			this._node = node;

			const hrefs = document.querySelectorAll('[data-section]');
			Object.entries(hrefs).forEach(([key, value]) => {
				value.addEventListener('click', () => {
					const target = event.target;
					const sectionName = target.getAttribute('data-section');
					event.preventDefault();
					if (target.tagName.toLowerCase() === 'a') {
						routes[sectionName]();
					}
				});
			});
		}
	}

	window.Application = Application;
	window.Router = Router;
})();
