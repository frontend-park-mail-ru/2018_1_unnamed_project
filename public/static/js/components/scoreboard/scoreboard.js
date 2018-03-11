(function() {
    /**
     * Компонент для отрисовки страницы лидеров.
     */
    class ScoreboardBuilder extends window.AbstractBuilder {
        /**
         * Отрисовывает компонент.
         */
        render() {
            if (this.data) {
                this.node.innerHTML = `
                <table class="scoreboard__table">
                    <tbody>
                        ${this.data.users.map(({email = 'example@mail.ru', username = 'durov', rank = 1488} = {}) => {
        // eslint-disable-next-line
                            return `
                            <tr class="scoreboard__row">
                                <td>${email}</td> 
                                <td>${username}</td> 
                                <td>${rank}</td>
                            </tr>
                            `;
        // eslint-disable-next-line
                        }).join('\n')}
                    </tbody>
                </table>
                <div class="pagination">
                    <a href="#" id="prev">\<</a>
                    <a href="#" id="next">\></a>
                </div>
                `;
                debugger;
                const prev = document.getElementById('prev');
                if (this.data.prevPage) {
                    prev.addEventListener('click', () => window.application.scoreboardPage.show(this.data.prevPage));
                } else {
                    prev.hidden = true;
                };
                const next = document.getElementById('next');
                if (this.data.nextPage) {
                    next.addEventListener('click', () => window.application.scoreboardPage.show(this.data.nextPage));
                } else {
                    next.hidden = true;
                };
            }
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
