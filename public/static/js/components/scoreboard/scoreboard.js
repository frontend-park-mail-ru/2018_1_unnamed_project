(function() {
    /**
     * Компонент для отрисовки страницы лидеров.
     */
    class ScoreboardBuilder extends window.AbstractBuilder {
        /**
         * Отрисовывает компонент.
         */
        render() {
            if (!this.data) return;

            super.render();
            const template = scoreboardTemplate({
                users: this._data.users,
            });
            this.node.insertAdjacentHTML('afterbegin', template);

            const prev = document.getElementById('prev');
            if (this.data.prevPage) {
                prev.addEventListener('click', () => window.application.scoreboardPage.show(this.data.prevPage));
            } else {
                prev.hidden = true;
            }
            const next = document.getElementById('next');
            if (this.data.nextPage) {
                next.addEventListener('click', () => window.application.scoreboardPage.show(this.data.nextPage));
            } else {
                next.hidden = true;
            }
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
