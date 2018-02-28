(function(){

    const noop = () => null;

    class Push extends window.AbstractBuilder{
        constructor(selector){
            super(selector);
            this._data = [];
        }
        set data(message = []){
            this._data.push(message);
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