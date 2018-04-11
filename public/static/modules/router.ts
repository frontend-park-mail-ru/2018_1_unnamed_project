import {Push} from "../components/push/push";
import {User} from "../models/user";
import {PageAccessTypes} from "../pages/page";
import bus from "./bus";

export enum RouterEvents {
    NavigateToPage = 'navigate_to',
    NavigateToNextPageOrRoot = 'navigate_to_next_page_or_root',
    Navigated = 'navigated',
}

export class Router {
    private static _Instance: Router;
    
    private _activePage;
    private _nextRoute;
    private _push: Push;
    private _root;
    private _routes;

    /**
     * @param {HTMLElement} root
     * @return {Router|*}
     */
    constructor(root) {
        if (Router._Instance) {
            return Router._Instance;
        }

        this._root = root;
        this._routes = {};
        this._activePage = null;

        this._nextRoute = null;

        this._push = new Push();

        Router._Instance = this;
    }

    /**
     * @return {string|null}
     */
    get nextRoute() {
        return this._nextRoute;
    }

    // noinspection TsLint
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
     * @private
     * @param {string} route
     * @param {Page} page
     * @return {Router}
     */
    renderRoute(route, page) {
        if (route === this._nextRoute) {
            this._nextRoute = null;
        }

        if (this._activePage) {
            this._activePage.destroy();
            this._activePage = null;
        }

        this._push.clear();
        this._activePage = page.create(null);

        if (window.location.pathname !== route) {
            window.history.pushState(null, null, route);
        }

        return this;
    }

    /**
     * @param {string} route
     * @return {Router}
     */
    navigateTo(route) {
        const page = this._routes[route];

        if (!page || page === this._activePage) {
            bus.emit(RouterEvents.Navigated);
            return this;
        }

        User.checkCurrentUser()
            .then(() => {
                switch (page.accessType()) {
                    case PageAccessTypes.NotLoggedInUser:
                        this.navigateTo('/');
                        break;
                    default:
                        this.renderRoute(route, page);
                }
                bus.emit(RouterEvents.Navigated);
            })
            .catch(() => {
                switch (page.accessType()) {
                    case PageAccessTypes.LoggedInUser:
                        const push = new Push();
                        push.addSharedMessage('Вы должны войти');

                        this._nextRoute = route;
                        this.navigateTo('/signin');

                        break;
                    default:
                        this.renderRoute(route, page);
                }
                bus.emit(RouterEvents.Navigated);
            });

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

        bus.on(RouterEvents.NavigateToPage, (route) => {
            this.navigateTo(route);
        });

        bus.on(RouterEvents.NavigateToNextPageOrRoot, () => {
            this.navigateTo(this.nextRoute || '/');
        });

        this.navigateTo(window.location.pathname);
    }
}
