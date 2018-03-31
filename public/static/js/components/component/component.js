'use strict';

// noinspection JSUnusedLocalSymbols
define( 'Component', (require) => {
    /**
     * Абстрактный класс компонента.
     */
    return class Component {
        /**
         * @param {Object}   element          Элемент, в котором рендерить.
         * @param {function} templateFunction Функция отрисовки pug.
         * @param {Object}   attrs            Параметры отрисовки.
         */
        constructor({element, templateFunction, attrs = {}}) {
            this.element = element;
            this.templateFunction = templateFunction;
            this.attrs = attrs;
        }

        /**
         * @return {Component}
         */
        clear() {
            this.element.innerHTML = '';
            return this;
        }

        /**
         * @param {Object} attrs Параметры отрисовки.
         * @return {Component}
         */
        render(attrs) {
            const renderAttrs = attrs || this.attrs;
            this.element.innerHTML = this.templateFunction(renderAttrs);
            return this;
        }
    };
});
