export abstract class Component {
    protected attrs;
    protected element;
    protected templateFunction;

    /**
     * @param {Object}   element          Элемент, в котором рендерить.
     * @param {function} templateFunction Функция отрисовки pug.
     * @param {Object}   attrs            Параметры отрисовки.
     */
    protected constructor({element, templateFunction, attrs = {}}) {
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
        if (!this.templateFunction) return this;

        const renderAttrs = attrs || this.attrs;
        this.element.innerHTML = this.templateFunction(renderAttrs);
        return this;
    }

    /**
     * Скрывает компонент.
     * @return {Component}
     */
    hide() {
        this.element.setAttribute('hidden', 'hidden');
        return this;
    }

    /**
     * Показывает компонент
     * @return {Component}
     */
    show() {
        this.element.removeAttribute('hidden');
        return this;
    }
}
