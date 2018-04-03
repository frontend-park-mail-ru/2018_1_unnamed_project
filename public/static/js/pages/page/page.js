'use strict';

define('Page', (require) => {
    /**
     * Базовый класс страницы.
     */
    return class Page {
        /**
         * @param {function} templateFunction Функция отрисовки pug.
         */
        constructor(templateFunction) {
            this.templateFunction = templateFunction;
            this.attrs = {};

            this._active = false;

            this.element = document.createElement('div');
            this.hide();
        }

        /**
         * Показывается ли эта страница сейчас.
         * @return {boolean}
         */
        get active() {
            return this._active;
        }

        /**
         * @return {Page}
         */
        hide() {
            this.element.setAttribute('hidden', 'hidden');
            this._active = false;
            return this;
        }

        /**
         * @return {Page}
         */
        show() {
            this.element.removeAttribute('hidden');
            this._active = true;
            return this;
        }

        /**
         * @return {Page}
         */
        clear() {
            this.element.innerHTML = '';
            return this;
        }

        /**
         * Рисует элемент.
         * @param {Object} attrs Атрибуты отрисовки.
         * @return {Page}
         */
        render(attrs) {
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
        renderTo(parent, attrs = {}) {
            this.render(attrs);
            parent.insertAdjacentElement('beforeend', this.element);
            return this;
        }

        /**
         * @param {Object} attrs Атрибуты отрисовки.
         * @return {Page}
         */
        create(attrs) {
            return this.render(attrs).show();
        }

        /**
         * @return {Page}
         */
        destroy() {
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
        accessType() {
            throw new Error('This method must be overridden');
        }
    };
});
