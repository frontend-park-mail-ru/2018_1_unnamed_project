(function() {
    class ScoreboardBuilder extends window.AbstractBuilder {
        render() {
            if (this._data) {
                this._node.innerHTML = `
                    <table class="scoreboard__table">
                        <tbody>
                            ${this._data.users.map(({
        email = 'example@mail.ru',
        username = 'durov',
        rank = 1488} = {}) => {
        return `
                                        <tr class="scoreboard__row">
                                            <td>${email}</td> 
                                            <td>${username}</td> 
                                            <td>${rank}</td>
                                        </tr>
                                    `;
    }).join('\n')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;
})();
