'use strict';

(function () {

	/**
	 * Компонент для отрисовки формы мультплеера.
	 */
	class Multiplayer extends window.AbstractBuilder {

		constructor(selector) {
			super(selector);
		}

		render() {
			if (!this.node) return;
			// noinspection SpellCheckingInspection
			this.node.innerHTML = `
                <img src="static/media/shingis.jpg">
            `;
		}
	}

	window.Multiplayer = Multiplayer;
})();
