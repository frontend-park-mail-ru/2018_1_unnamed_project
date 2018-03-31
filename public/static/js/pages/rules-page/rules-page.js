/* eslint-disable */
'use strict';

define('RulesPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

    /**
     * Страница с праилами игры.
     */
    return class RulesPage extends Page {
        /**
         *
         */
        constructor() {
            super(rulesPageTemplate);
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.ANY_USER;
        }
    }
});
