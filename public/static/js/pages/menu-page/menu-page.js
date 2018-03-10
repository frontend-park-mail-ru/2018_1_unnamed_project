'use strict';

(function () {

	class MenuPage extends window.AbstractPage {

		constructor({parentId = 'application', pageId = 'menu'}) {
			super({parentId, pageId});
			this._parentNode.innerHTML += `
			<section id="menu" hidden>
		        <div class="header">SHIP<br>COLLISION</div>
		        <hr>
		        <div class="menu">
		            <ul>
		                <li>
		                    <a href="#" data-section="multiplayer">Multiplayer</a>
		                </li>
		                <li>
		                    <a href="#" data-section="singleplayer">Singleplayer</a>
		                </li>
		                <li>
		                    <a href="#" data-section="scoreboard">Scoreboard</a>
		                </li>
		                <li>
		                    <a href="#" data-section="rules">Rules</a>
		                </li>
		            </ul>
		        </div>
		    </section>
			`;
		}
	}

	window.MenuPage = MenuPage;
})();
