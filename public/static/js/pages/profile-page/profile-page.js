'use strict';

define('ProfilePage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');
    const User = require('User');

    /**
     * Страница профиля текущего пользователя.
     */
    return class ProfilePage extends Page {
        /**
         *
         */
        constructor() {
            super(profilePageTemplate);
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {Page}
         */
        render(attrs) {
            return super.render(Object.assign({}, attrs, User.currentUser));
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
