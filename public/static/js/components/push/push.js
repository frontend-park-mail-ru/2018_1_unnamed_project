(function(){

    const noop = () => null;

    class Push {
        constructor(selector = 'body') {
            this._node = document.querySelector(selector);
            this._data = [];
        }

        get data(){
            return this._data;
        }

        set data(message = []){
            this._data.push(message);
        }

        clear(){
            this._node.innerHTML = '';
        }

        render(level = 'info') {
            if (!(this._data && this._node)) return;
            this._data.forEach(message => {
                this._node.innerHTML += `
                    <div class="msg_${level}">${message}</span>
                `;
            });
            this._data = [];
        }
    }

    window.Push = Push;


})();