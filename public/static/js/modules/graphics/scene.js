'use strict';

define('graphics/Scene', (require) => {
    /**
     * Сцена для отрисовки графики.
     */
    return class Scene {
        /**
         * @param {Object} ctx Контекст canvas.
         */
        constructor(ctx) {
            this.ctx = ctx;
            this.figures = new Map();

            this._id = 0;
        }

        /**
         * Возвращает новый id для фигуры.
         * @private
         * @return {Number}
         */
        getNextId() {
            return this._id++;
        }

        /**
         * Добавляет фигуру на сцену (сразу отрисовывает).
         * @param {Figure} figure
         * @return {Number}
         */
        addFigure(figure) {
            const id = this.getNextId();
            this.figures.set(id, figure);
            return id;
        }

        /**
         * Удаляет фигуру по id.
         * @param {Number} id
         * @return {Scene}
         */
        removeFigure(id) {
            this.figures.delete(id);

            if (!this.figures.size) {
                console.log('Figures set is empty');
            }

            return this;
        }

        /**
         * @return {Scene}
         */
        render() {
            this.clear();
            this.figures.forEach((figure) => figure.render());
            return this;
        }

        /**
         * @return {Scene}
         */
        clear() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return this;
        }

        /**
         * Полностью очищает сцену.
         * @return {Scene}
         */
        removeAll() {
            this.clear();
            this.figures.clear();
            this._id = 0;
            return this;
        }
    };
});
