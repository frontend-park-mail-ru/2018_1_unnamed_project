'use strict';

define('MultiplayerPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const Push = require('Push');
    const PushLevels = require('Push/levels');
    const UserEvents = require('User/events');

    const bus = require('bus');

    /**
     * Страница многопользовательской игры.
     */
    return class MultiplayerPage extends Page {
        /**
         *
         */
        constructor() {
            super(multiplayerPageTemplate);

            bus.on(UserEvents.CURRENT_USER_CHANGED, (newUser) => {
                if (!newUser) return;
                new Push().addSharedMessage(`Добро пожаловать, ${newUser.username}`);
            });
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {MultiplayerPage}
         */
        render(attrs) {
            super.render(attrs);
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
