'use strict';

(function () {

	class MultiplayerPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'multiplayer'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="multiplayer"></div>
		    </section>
			`;
		}
	}

	window.MultiplayerPage = MultiplayerPage;l
})();
