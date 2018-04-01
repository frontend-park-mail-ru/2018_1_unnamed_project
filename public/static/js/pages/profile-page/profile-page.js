'use strict';

define('ProfilePage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const User = require('User');
    const UserEvents = require('User/events');

    const bus = require('bus');

    /**
     * Страница профиля текущего пользователя.
     */
    return class ProfilePage extends Page {
        /**
         *
         */
        constructor() {
            super(profilePageTemplate);

            bus.on(UserEvents.CURRENT_USER_CHANGED, (newUser) => {
                if (!newUser) return;
                new Push().addSharedMessage(`Добро пожаловать, ${newUser.username}`);
            });
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {Page}
         */
        render(attrs) {
            super.render(Object.assign({}, attrs, User.currentUser));
            new Push().renderShared({level: PushLevels.MSG_SUCCESS});
            return this;
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.LOGGED_IN_USER;
        }
    };
});
