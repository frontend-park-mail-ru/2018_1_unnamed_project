'use strict';

/**
 * Модуль приложения.
 */
(function() {
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
    const settingsPage = new window.SettingsPage();
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

    /**
     * Вспомогательная функция открытия страниц.
     * @param {Object} routerObject
     */
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
        // noinspection JSMethodCanBeStatic
        /**
         * Переключает на нужную страницу.
         * @param {string} routeName Имя страницы, см. script.js.
         */
        navigateTo(routeName) {
            if (routeName in routes) {
                openPage(routes[routeName]);
            }
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Добавляет новый маршрут.
         * @param {string} name Идентификатор маршрута.
         * @param {RegExp} re Регулярное выражение, по которому будет матчиться URL.
         * @param {window.AbstractPage} page Страница, которую необходимо открыть.
         * @param {boolean} hideBackRef Флаг, показывающий, нужно ли скрывать ссылку "на главнуб страницу".
         * @return {Router}
         */
        addRoute(name, {re = null, page = null, hideBackRef = false} = {}) {
            routes[name] = {re, page, hideBackRef};
            return this;
        }
    }

    /**
     * Главный класс приложения.
     */
    class Application {
        /**
         * Навешивает на клик ссылок начальной страницы обработчики для навигации по приложению.
         */
        constructor() {
            const hrefs = document.querySelectorAll('[data-section]');
            Object.entries(hrefs).forEach(([key, value]) => {
                value.addEventListener('click', window.anchorSubmitListener);
            });
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает ссылку на статусбар с именем пользователя.
         * @return {HTMLElement}
         */
        get profileBar() {
            if (!profileBar) {
                profileBar = document.getElementById('bar');
            }
            return profileBar;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает объект для отображения пуш-уведомлений.
         * @return {Push|*}
         */
        get push() {
            return push;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу меню.
         * @return {MenuPage|*}
         */
        get menuPage() {
            return menuPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу мультиплеера.
         * @return {MultiplayerPage|*}
         */
        get multiplayerPage() {
            return multiplayerPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу профиля.
         * @return {ProfilePage|*}
         */
        get profilePage() {
            return profilePage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу с настройками профиля
         * @return {SettingsPage|*}
         */
        get settingsPage() {
            return settingsPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу с правилами.
         * @return {RulesPage|*}
         */
        get rulesPage() {
            return rulesPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу со списком лидеров.
         * @return {ScoreboardPage|*}
         */
        get scoreboardPage() {
            return scoreboardPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу логина.
         * @return {SignInPage|*}
         */
        get signinPage() {
            return signinPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу регистрации.
         * @return {SignUpPage|*}
         */
        get signupPage() {
            return signupPage;
        }

        // noinspection JSMethodCanBeStatic
        /**
         * Возвращает страницу синглплеера.
         * @return {SingleplayerPage|*}
         */
        get singleplayerPage() {
            return singleplayerPage;
        }
    }

    /**
     * Листенер для добавления возможности переключения между страницами.
     */
    window.anchorSubmitListener = () => {
        const target = event.target;
        const sectionName = target.getAttribute('data-section');
        event.preventDefault();
        if (target.tagName.toLowerCase() === 'a') {
            window.router.navigateTo(sectionName);
        }
    };

    window.application = new Application();
    window.router = new Router();
})();
