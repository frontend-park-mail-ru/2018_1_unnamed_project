'use strict';

(function () {

	class Multiplayer extends window.AbstractBuilder {

		constructor(selector) {
			super(selector);
		}

		render() {
			if (!this.node) return;
			this.node.innerHTML = `
                <img src="static/media/shingis.jpg">
            `;
		}
	}

	window.Multiplayer = Multiplayer;
})();
