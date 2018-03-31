'use strict';

define('MultiplayerPage', (require) => {
    const Page = require('Page');
    const AccessTypes = require('Page/access');

    /**
     * Страница многопользовательской игры.
     */
    return class MultiplayerPage extends Page {
        /**
         *
         */
        constructor() {
            super(multiplayerPageTemplate);
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
