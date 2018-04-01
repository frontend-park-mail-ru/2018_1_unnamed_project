'use strict';

define('ProfileBar', (require) => {
    const User = require('User');

    return class ProfileBar {
        constructor() {
            this.element.querySelector('#profile-bar__logout').addEventListener('click', (evt) => {
                evt.preventDefault();
                User.logout();
            });

            this.text = 'Unauthorized';
        }

        get element() {
            return document.getElementById('profile-bar');
        }

        set text(text) {
            this.element.querySelector('#profile-bar__username').innerText = text;
        }

        set logoutAvailable(available) {
            const logout = this.element.querySelector('#profile-bar__logout');
            if (available) {
                logout.removeAttribute('hidden');
            } else {
                logout.setAttribute('hidden', 'true');
            }
        }
    };
});
