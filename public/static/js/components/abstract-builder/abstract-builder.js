'use strict';

(function () {

	class AbstractBuilder {

		constructor(selector = 'body') {
			this._api = new window.API();
			this._node = document.querySelector(selector);
		}

		get data() {
			return this._data;
		}

		set data(data) {
			this._data = data;
		}

		get node() {
			return this._node;
		}

		clear() {
			this._node.innerHTML = '';
		}

		render() {
		};
	}

	window.AbstractBuilder = AbstractBuilder;
})();
