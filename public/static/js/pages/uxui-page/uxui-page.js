/* eslint-disable */
'use strict';

define('UxUiPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

    /**
     * Страница ДИЗИГНА!!1!
     */
    return class UxUiPage extends Page {
        /**
         *
         */
        constructor() {
            super(uxuiPageTemplate);
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
