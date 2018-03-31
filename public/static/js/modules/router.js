'use strict';

define('Router', (require) => {
    const AccessTypes = require('Page/access');
    const User = require('User');

    /**
     * Роутер.
     */
    return class Router {
        /**
         * @param {HTMLElement} root
         * @return {Router|*}
         */
        constructor(root) {
            if (Router.__instance) {
                return Router.__instance;
            }

            this._root = root;
            this._routes = {};
            this._activePage = null;

            Router.__instance = this;
        }

        /**
         * @param {string} route
         * @param {Page} PageClass
         * @return {Router}
         */
        addRoute(route, PageClass) {
            this._routes[route] = new PageClass().renderTo(this._root);
            return this;
        }

        /**
         * @param {string} route
         * @return {Router}
         */
        navigateTo(route) {
            const page = this._routes[route];

            if (!page || page === this._activePage) {
                // TODO: 404;
                return this;
            }

            // noinspection FallThroughInSwitchStatementJS
            switch (page.accessType()) {
            case AccessTypes.ANY_USER:
                break;
            case AccessTypes.LOGGED_IN_USER:
                if (!User.isAuthorized()) {
                    this.navigateTo('/login');
                    return this;
                }
            default:
                break;
            }

            if (this._activePage) {
                this._activePage.destroy();
                this._activePage = null;
            }

            this._activePage = page.create();

            if (window.location.pathname !== route) {
                window.history.pushState(null, null, route);
            }

            return this;
        }

        /**
         * Запуск роутера.
         */
        start() {
            window.addEventListener('popstate', () => this.navigateTo(window.location.pathname));

            this._root.addEventListener('click', (evt) => {
                if (evt.target.tagName.toLowerCase() === 'a') {
                    evt.preventDefault();
                    this.navigateTo(evt.target.pathname);
                }
            });

            this.navigateTo(window.location.pathname);
        }
    };
});
