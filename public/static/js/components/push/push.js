(function () {

	class Push extends window.AbstractBuilder {

		constructor(selector) {
			super(selector);
			this._data = [];
		}

		get data() {
			return this._data;
		}

		set data(message) {
			this._data.push(message);
		}

		clear() {
			super.clear();
			this._data = [];
		}

		render(level = 'info') {
			if (!(this._data && this.node)) return;
			this.node.innerHTML = '';
			this._data.forEach(message => {
				this.node.innerHTML += `
                    <div class="msg_${level}">${message}</span>
                `;
			});
			this._data = [];
		}
	}

	window.Push = Push;
})();