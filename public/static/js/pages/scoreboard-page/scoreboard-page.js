'use strict';

(function () {

	class ScoreboardPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'scoreboard'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="js-scoreboard-table"></div>
		    </section>
			`;
		}
	}

	window.ScoreboardPage = ScoreboardPage;
})();
