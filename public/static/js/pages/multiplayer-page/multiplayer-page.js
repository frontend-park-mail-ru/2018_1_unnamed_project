'use strict';

define('MultiplayerPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

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
