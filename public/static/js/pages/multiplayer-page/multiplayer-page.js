'use strict';

(function () {

	class MultiplayerPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'multiplayer'} = {}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="multiplayer"></div>
		    </section>
			`;
			this._builder = new window.Multiplayer('multiplayer');
		}

		show() {
			super.show();

			const self = this;
			this._api.getMe()
				.then(() => self._builder.render());
		}
	}

	window.MultiplayerPage = MultiplayerPage;
})();
