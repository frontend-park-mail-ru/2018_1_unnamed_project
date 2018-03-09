(function() {
    class Push extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
            this._data = [];
        }
        set data(message = []) {
            this._data.push(message);
        }

        get data() {
            return this._data;
        }

        render(level = 'info') {
            if (!(this._data && this._node)) return;
            this._node.innerHTML = '';
            this._data.forEach((message) => {
                this._node.innerHTML += `
                    <div class="msg_${level}">${message}</span>
                `;
            });
            this._data = [];
        }
    }

    window.Push = Push;
})();
