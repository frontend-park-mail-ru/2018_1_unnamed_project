'use strict';

define('ProfileBar', (require) => {
    return class ProfileBar {
        constructor() {
            this.element.innerText = 'Unauthorized';
        }

        get element() {
            return this._element || (this._element = document.getElementById('profile-bar'));
        }

        set text(text) {
            this.element.innerText = text;
        }
    };
});
