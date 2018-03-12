(function() {
    /**
     * Компонент для отрисовки страницы лидеров.
     */
    class ScoreboardBuilder extends window.AbstractBuilder {
        /**
         * Навешивает event listener-ы на кнопки вперед/назад под scoreboard
         * @param {string} selector кнопки
         * @param {function} callback
         */
        prevNextEventHandler(selector, callback) {
            debugger;
            const button = document.getElementById(selector);
            if (callback) {
                button.addEventListener('click', () => {
                    event.preventDefault();
                    window.application.scoreboardPage.show(callback);
                });
            } else {
                button.hidden = true;
            }
        }
        /**
         * Отрисовывает компонент.
         */
        render() {
            if (!this.data) return;

            super.render();

            // noinspection JSUnresolvedFunction
            const template = scoreboardTemplate({
                users: this._data.users,
            });
            this.node.insertAdjacentHTML('afterbegin', template);
            this.prevNextEventHandler('prev', this.data.prevPage);
            this.prevNextEventHandler('next', this.data.nextPage);
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
