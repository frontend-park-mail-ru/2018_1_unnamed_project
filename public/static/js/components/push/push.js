(function() {
    const AbstractBuilder = window.AbstractBuilder;
    /**
     * Компонент для рендеринга уведомлений.
     */
    class Push extends AbstractBuilder {
        /**
         * @param {string} selector CSS-селектор для выбора элемента.
         */
        constructor(selector) {
            super(selector);
            this._data = [];
        }

        /**
         * @return {Array}
         */
        get data() {
            return this._data;
        }

        // noinspection JSAnnotator
        /**
         * Добавляет сообщение в конец.
         * @param {Object} message
         */
        set data(message) {
            this._data.push(message);
        }

        /**
         * Очищает список сообщений.
         */
        clear() {
            super.clear();
            this._data = [];
        }

        /**
         * Отрисовывает список сообщений соответствующим цветом
         * в зависимости от уровня.
         * @param {string} level Уровень сообщений.
         */
        render(level = 'info') {
            if (!(this._data && this.node)) return;

            // noinspection JSUnresolvedFunction
            const template = pushTemplate({
                level,
                messages: this._data,
            });
            this.clear();
            this.node.insertAdjacentHTML('afterbegin', template);
            this._data = [];
        }
    }

    window.Push = Push;
})();
