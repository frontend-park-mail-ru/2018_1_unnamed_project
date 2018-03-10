'use strict';

/**
 * Модуль приложения.
 */
(function () {

	/**
	 * Установка разметки, необходимой для начала работы.
	 */

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

	/**
	 * Создание страниц.
	 */

	const menuPage = new window.MenuPage();
	const multiplayerPage = new window.MultiplayerPage();
	const profilePage = new window.ProfilePage();
	const rulesPage = new window.RulesPage();
	const scoreboardPage = new window.ScoreboardPage();
	const signinPage = new window.SignInPage();
	const signupPage = new window.SignUpPage();
	const singleplayerPage = new window.SingleplayerPage();

	/**
	 * Внутренние переменные для роутера.
	 */

	let currentPage = null;

	const routes = {};

	const backRef = document.getElementById('back');

	let profileBar = document.getElementById('bar');

	const push = new window.Push('.msg');

	function openPage(routerObject) {
		backRef.hidden = routerObject.hideBackRef;
		push.clear();

		if (currentPage) {
			currentPage.hide();
		}

		currentPage = routerObject.page;
		currentPage.show();
	}

	/**
	 * Роутер приложения
	 */
	class Router {

		/**
		 * Переключает на нужную страницу.
		 * @param routeName Имя страницы, см. script.js.
		 */
		static navigateTo(routeName) {
			if (routeName in routes) {
				openPage(routes[routeName]);
			}
		}

		/**
		 * Добавляет новый маршрут
		 * @param name Идентификатор маршрута.
		 * @param re Регулярное выражение, по которому будет матчиться URL.
		 * @param page Страница, которую необходимо открыть.
		 * @param hideBackRef Флаг, показывающий, нужно ли скрывать ссылку "на главнуб страницу".
		 * @returns {Router}
		 */
		static addRoute(name, {re = '', page = null, hideBackRef = false} = {}) {
			routes[name] = {re, page, hideBackRef};
			return this;
		}
	}

	/**
	 * Главный класс приложения.
	 */
	class Application {

		constructor() {
			const hrefs = document.querySelectorAll('[data-section]');
			Object.entries(hrefs).forEach(([key, value]) => {
				value.addEventListener('click', window.anchorSubmitListener);
			});
		}

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
	}

	/**
	 * Листенер для добавления вохможности переключения между страницами.
	 */
	window.anchorSubmitListener = () => {
		const target = event.target;
		const sectionName = target.getAttribute('data-section');
		event.preventDefault();
		if (target.tagName.toLowerCase() === 'a') {
			window.Router.navigateTo(sectionName);
		}
	};

	window.Application = Application;
	window.Router = Router;
})();
