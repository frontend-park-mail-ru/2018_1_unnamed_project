(function(){

    const noop = () => null;

    class ScoreboardBuilder{

        constructor(selector = 'body'){
            this._node = document.querySelector(selector);
        }

        get data(){
            return this._data;
        }

        set data(data = []){
            this._data = data;
        }

        clear(){
            this._node.innerHTML = '';
        }

        render(){
            if(this._data){
                console.log(this._data);
                this._node.innerHTML = `
                    <table class="scoreboard__table">
                        <tbody>
                            ${
                                this._data.map(({email = 'example@mail.ru', username = 'durov', rate = 1488} = {}) => {
                                    return `
                                        <tr class="scoreboard__row">
                                            <td>${email}</td> 
                                            <td>${username}</td> 
                                            <td>${rate}</td>
                                        </tr>
                                    `
                                }).join('\n')}
                        </tbody>
                    </table>
                `
            }
        }
    }

    window.ScoreboardBuilder = ScoreboardBuilder;

})();