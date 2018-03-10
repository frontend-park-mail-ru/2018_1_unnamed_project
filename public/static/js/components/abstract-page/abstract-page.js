'use strict';

(function () {

	class AbstractPage {

		constructor({parentId = '', pageId = ''} = {}) {
			this._pageId = pageId;
			this._parentId = parentId;
			this._builder = null;
			this._api = new window.API();
		}

		get api() {
			return this._api;
		}

		get builder() {
			return this._builder;
		}

		get pageNode() {
			return document.getElementById(this._pageId);
		}

		get parentNode() {
			return document.getElementById(this._parentId);
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
