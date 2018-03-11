(function() {
    /**
     * Компонент для отрисовки страницы лидеров.
     */
    class ScoreboardBuilder extends window.AbstractBuilder {
        /**
         * Отрисовывает компонент.
         */
        render() {
            if (this._data) {
                this.node.insertAdjacentHTML('afterbegin', scoreboardTemplate({users: this._data.users}));
        //         this.node.innerHTML = `
        //         <table class="scoreboard__table">
        //             <tbody>
        //                 ${this._data.users.map(({email = 'example@mail.ru', username = 'durov', rank = 1488} = {}) => {
        // // eslint-disable-next-line
        //                     return `
        //                     <tr class="scoreboard__row">
        //                         <td>${email}</td>
        //                         <td>${username}</td>
        //                         <td>${rank}</td>
        //                     </tr>
        //                     `;
        // // eslint-disable-next-line
        //                 }).join('\n')}
        //                 </tbody>
        //             </table>
        //         `;
            }
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
