(function() {
    /**
     * Компонент для отрисовки страницы лидеров.
     */
    class ScoreboardBuilder extends window.AbstractBuilder {
        /**
         * Отрисовывает компонент.
         */
        render() {
            if (!this._data) return;

            super.render();
            // noinspection JSUnresolvedFunction
            this.node.insertAdjacentHTML('afterbegin', scoreboardTemplate({users: this._data.users}));
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
