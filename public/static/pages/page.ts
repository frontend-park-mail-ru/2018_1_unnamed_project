import {Push} from "../components/push/push";

export enum PageAccessTypes {
    AnyUser = 'any_user',
    LoggedInUser = 'logged_in_user',
    NotLoggedInUser = 'not_logged_in_user',
}

export class Page {
    protected attrs: object;
    protected element: Element;
    protected templateFunction: (locals) => any;
    protected push: Push;
    private _active: boolean;

    /**
     * @param {function} templateFunction Функция отрисовки pug.
     */
    constructor(templateFunction?: (locals) => any) {
        this.templateFunction = templateFunction;
        this.attrs = {};
        this.push = new Push();

        this._active = false;

        this.element = document.createElement('div');
        this.hide();
    }

    /**
     * Показывается ли эта страница сейчас.
     * @return {boolean}
     */
    public get active(): boolean {
        return this._active;
    }

    /**
     * @return {Page}
     */
    public hide(): Page {
        this.element.setAttribute('hidden', 'hidden');
        this._active = false;
        return this;
    }

    /**
     * @return {Page}
     */
    public show(): Page {
        this.element.removeAttribute('hidden');
        this._active = true;
        return this;
    }

    /**
     * @return {Page}
     */
    public clear(): Page {
        this.element.innerHTML = '';
        return this;
    }

    /**
     * Рисует элемент.
     * @param {Object} attrs Атрибуты отрисовки.
     * @return {Page}
     */
    public render(attrs: object): Page {
        const renderAttrs = attrs || this.attrs;
        this.element.innerHTML = this.templateFunction(renderAttrs);
        return this;
    }

    /**
     * Рисует элемент внутри родительского.
     * @param {Object} parent Родительский элемент.
     * @param {Object} attrs  Атрибуты отрисовки.
     * @return {Page}
     */
    public renderTo(parent: Element, attrs: object = null): Page {
        this.render(attrs);
        parent.insertAdjacentElement('beforeend', this.element);
        return this;
    }

    /**
     * @param {Object} attrs Атрибуты отрисовки.
     * @return {Page}
     */
    public create(attrs: object): Page {
        return this.render(attrs).show();
    }

    /**
     * @return {Page}
     */
    public destroy(): Page {
        return this.hide().clear();
    }

    /**
     * Права доступа к странице. Нужны для роутинга.
     * Каждая страница знает только название "группы" доступа.
     * Роутер в зависимости от "группы" доступа проверяет права текущего пользователя и или отрисовывет
     * ему страницу, или предпринимает что-то еще (например, ничего).
     * @abstract
     * @return {string}
     */
    public accessType(): PageAccessTypes {
        throw new Error('This method must be overridden');
    }
}
