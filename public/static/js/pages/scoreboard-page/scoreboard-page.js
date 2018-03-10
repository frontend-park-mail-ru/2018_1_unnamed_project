'use strict';

(function () {

	class ScoreboardPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'scoreboard'} = {}) {
			super({parentId, pageId});

			this.parentNode.innerHTML += `
			<section id="${pageId}" hidden>
		        <div class="js-scoreboard-table"></div>
		    </section>
			`;
			this._builder = new window.ScoreboardBuilder('.js-scoreboard-table');
		}

		show() {
			super.show();

			const self = this;
			this.api.scoreboard()
				.then(users => {
					self._builder.data = users;
					self._builder.render();
				});
		}
	}

	window.ScoreboardPage = ScoreboardPage;
})();
