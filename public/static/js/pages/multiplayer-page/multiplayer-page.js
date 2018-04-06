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

            this.setAuthenticationDoneHandler();
        }

        /**
         * @private
         * @return {MultiplayerPage}
         */
        setAuthenticationDoneHandler() {
            bus.on(UserEvents.AUTHENTICATION_DONE, (newUser) => {
                if (!this.active || !newUser) return;

                const push = new Push();
                push.addSharedMessage(`Добро пожаловать, ${newUser.username}`);
            });

            return this;
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {MultiplayerPage}
         */
        render(attrs) {
            super.render(attrs);
            const push = new Push();
            push.renderShared({level: PushLevels.MSG_SUCCESS});
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
