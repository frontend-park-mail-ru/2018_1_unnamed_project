'use strict';

(function () {

	/**
	 * Абстрактный компонент для построения форм интерфейсов.
	 */
	class AbstractBuilder {

		/**
		 * @param selector Селектор для поиска тега для вставки.
		 * Селектор должен присуствовать на странице до вызова конструктора.
		 */
		constructor(selector = 'body') {
			this._api = new window.API();
			this._selector = selector;
		}

		get api() {
			return this._api;
		}

		get data() {
			return this._data;
		}

		set data(data) {
			this._data = data;
		}

		get node() {
			return document.querySelector(this._selector);
		}

		clear() {
			this.node.innerHTML = '';
		}

		render() {
		};
	}

	window.AbstractBuilder = AbstractBuilder;
})();
