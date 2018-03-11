'use strict';

(function() {
    /**
     * Абстрактный компонент для построения форм интерфейсов.
     */
    class AbstractBuilder {
        /**
         * @param {string} selector Селектор для поиска тега для вставки.
         * Селектор должен присуствовать на странице до вызова конструктора.
         */
        constructor(selector = 'body') {
            this._api = new window.API();
            this._selector = selector;
        }

        /**
         * Геттер инстанса для доступа к API.
         * @return {API|*}
         */
        get api() {
            return this._api;
        }

        /**
         * @return {*}
         */
        get data() {
            return this._data;
        }

        /**
         * @param {Object} data
         */
        set data(data) {
            this._data = data;
        }

        /**
         * Геттер текущего узла для вставки разметки.
         * @note Необходимо пересчитывать каждый раз для корректной вставки.
         * @return {ElementTagNameMap | null}
         */
        get node() {
            return document.querySelector(this._selector);
        }

        /**
         * Удаляет всю разметку элемента.
         */
        clear() {
            this.node.innerHTML = '';
        }

        /**
         * Отрисовывает элемент.
         */
        render() {
            this.clear();
        };
    }

    window.AbstractBuilder = AbstractBuilder;
})();
