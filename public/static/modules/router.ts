import {Push} from "../components/push/push";
import gameBus from "../game/game-bus";
import {User} from "../models/user";
import {Page, PageAccessTypes} from "../pages/page";
import bus from "./bus";

export enum RouterEvents {
    NavigateToPage = 'navigate_to',
    NavigateToNextPageOrRoot = 'navigate_to_next_page_or_root',
    Navigated = 'navigated',
}

export class Router {
    private static _Instance: Router;
    
    private _activePage: Page;
    private _nextRoute: string;
    private _push: Push;
    private _root: Element;
    private _routes: Map<string, Page>;

    /**
     * @param {HTMLElement} root
     * @return {Router|*}
     */
    constructor(root: Element) {
        if (Router._Instance) {
            return Router._Instance;
        }

        this._root = root;
        this._routes = new Map<string, Page>();
        this._activePage = null;

        this._nextRoute = null;

        this._push = new Push();

        Router._Instance = this;
    }

    /**
     * @return {string|null}
     */
    public get nextRoute(): string {
        return this._nextRoute;
    }

    // noinspection TsLint
    /**
     * @param {string} route
     * @param {Page} PageClass
     * @return {Router}
     */
    public addRoute(route: string, PageClass: typeof Page): Router {
        this._routes.set(route, new PageClass().renderTo(this._root));
        return this;
    }

    /**
     * @private
     * @param {string} route
     * @param {Page} page
     * @return {Router}
     */
    public renderRoute(route: string, page: Page): Router {
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
    public navigateTo(route: string): Router {
        const page = this._routes.get(route);

        if (!page || page === this._activePage) {
            bus.emit(RouterEvents.Navigated, null);
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
                bus.emit(RouterEvents.Navigated, route);
            })
            .catch(() => {
                switch (page.accessType()) {
                    case PageAccessTypes.LoggedInUser:
                        const push = new Push();
                        push
                            .clearMessages()
                            .clearSharedMessages()
                            .addSharedMessage('Вы должны войти');

                        this._nextRoute = route;
                        this.navigateTo('/signin');

                        break;
                    default:
                        this.renderRoute(route, page);
                }
                bus.emit(RouterEvents.Navigated, route);
            });

        return this;
    }

    /**
     * Запуск роутера.
     */
    public start(): void {
        window.addEventListener('popstate', () => this.navigateTo(window.location.pathname));

        this._root.addEventListener('click', (evt) => {
            if ((evt.target as any).tagName.toLowerCase() === 'a') {
                evt.preventDefault();
                this.navigateTo((evt.target as any).pathname);
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
