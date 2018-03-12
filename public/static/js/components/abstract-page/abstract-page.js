'use strict';

(function() {
    /**
     * Абстрактный компонент для представления страниц.
     */
    class AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = '', pageId = ''} = {}) {
            this._pageId = pageId;
            this._parentId = parentId;
            this._builder = null;
            this._api = new window.API();
        }

        /**
         * Геттер инстанса для доступа к API.
         * @return {API|*}
         */
        get api() {
            return this._api;
        }

        /**
         * Возвращает связанный со страницей наследник window.AbstractBuilder.
         * @see AbstractBuilder
         * @return {AbstractBuilder | null}
         */
        get builder() {
            return this._builder;
        }

        /**
         * Возвращает элемент страницы.
         * @return {HTMLElement | null}
         */
        get pageNode() {
            return document.getElementById(this._pageId);
        }

        /**
         * Возвращает родительский элемент страницы.
         * @return {HTMLElement | null}
         */
        get parentNode() {
            return document.getElementById(this._parentId);
        }

        /**
         * Скрывает страницу.
         */
        hide() {
            if (this.builder) {
                this._builder.clear();
            }

            this.pageNode.hidden = true;
        }

        /**
         * Показывает страницу.
         */
        show() {
            this.pageNode.hidden = false;
        }
    }

    window.AbstractPage = AbstractPage;
})();
