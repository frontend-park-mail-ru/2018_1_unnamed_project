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

            this.setAuthenticationDoneHandler();
        }

        /**
         * @private
         * @return {ProfilePage}
         */
        setAuthenticationDoneHandler() {
            bus.on(UserEvents.AUTHENTICATION_DONE, (newUser) => {
                if (!this.active || !newUser) return;

                const push = new Push();
                push
                    .clear()
                    .addSharedMessage(`Добро пожаловать, ${newUser.username}`);
            });

            return this;
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {Page}
         */
        render(attrs) {
            super.render(Object.assign({}, attrs, User.currentUser));
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
