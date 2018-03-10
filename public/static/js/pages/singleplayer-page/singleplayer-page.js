'use strict';

(function () {

	class SingleplayerPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'singleplayer'} = {}) {
			super({parentId, pageId});
			this.parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <img src="static/media/singleplayer.jpg" style="width: 800px">
		    </section>
			`;
		}
	}

	window.SingleplayerPage = SingleplayerPage;
})();
