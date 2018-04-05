'use strict';

define('Router', (require) => {
    const AccessTypes = require('Page/access');
    const Push = require('Push');
    const User = require('User');

    const bus = require('bus');

    const events = require('Router/events');

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

            this._nextRoute = null;

            Router.__instance = this;
        }

        /**
         * @return {string|null}
         */
        get nextRoute() {
            return this._nextRoute;
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
                    this._nextRoute = route;

                    const push = new Push();
                    push.addSharedMessage('Войдите для продолжения');

                    this.navigateTo('/signin');

                    return this;
                }
                break;
            case AccessTypes.NOT_LOGGED_IN_USER:
                if (User.isAuthorized()) {
                    return this;
                }
                break;
            default:
                break;
            }

            if (route === this._nextRoute) {
                this._nextRoute = null;
            }

            if (this._activePage) {
                this._activePage.destroy();
                this._activePage = null;
            }

            new Push().clear();
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

            bus.on(events.NAVIGATE_TO_PAGE, (route) => {
                this.navigateTo(route);
            });

            bus.on(events.NAVIGATE_TO_NEXT_PAGE_OR_ROOT, (route = null) => {
                this.navigateTo(this.nextRoute || '/');
            });

            this.navigateTo(window.location.pathname);
        }
    };
});
