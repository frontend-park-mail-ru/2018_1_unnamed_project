'use strict';

define('ProfileBar', (require) => {
    const UserEvents = require('User/events');

    const bus = require('bus');

    return class ProfileBar {
        constructor() {
            this.element.innerText = 'Unauthorized';

            bus.on(UserEvents.CURRENT_USER_CHANGED, (newUser) => {
                if (newUser) {
                    this.element.innerText = newUser.username;
                } else {
                    this.element.innerText = 'Unauthorized';
                }
            });
        }

        get element() {
            return document.getElementById('profile-bar');
        }
    };
});
