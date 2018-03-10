'use strict';

(function () {

	class AbstractPage {

		constructor({parentId = '', pageId = ''} = {}) {
			this._pageId = pageId;

			this._parentNode = document.getElementById(parentId);
			this._pageNode = document.getElementById(pageId);

			this._builder = null;

			this._api = new window.API();
		}

		get builder() {
			return this._builder;
		}

		get pageNode() {
			if (!this._pageNode) {
				this._pageNode = document.getElementById(this._pageId);
				return this._pageNode;
			}
		}

		hide() {
			this.pageNode.hidden = true;
		}

		show() {
			this.pageNode.hidden = false;
		}
	}

	window.AbstractPage = AbstractPage;
})();
