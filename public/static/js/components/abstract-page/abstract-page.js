'use strict';

(function () {

	class AbstractPage {

		constructor({parentId = '', pageId = ''} = {}) {
			this._parentNode = document.getElementById(parentId);
			this._pageNode = document.getElementById(pageId);
		}

		hide() {
			this._pageNode.hidden = true;
		}

		show() {
			this._pageNode.hidden = false;
		}
	}

	window.AbstractPage = AbstractPage;
})();
