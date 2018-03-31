/* eslint-disable */
'use strict';

define('UxUiPage', (require) => {
    const AccessTypes = require('Page/access');
    const Page = require('Page');

    return class UxUiPage extends Page {
        constructor() {
            super(uxuiPageTemplate);
        }

        accessType() {
            return AccessTypes.ANY_USER;
        }
    }
});
