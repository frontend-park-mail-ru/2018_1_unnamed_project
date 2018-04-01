'use strict';

define('User/events', (require) => {
    return {
        CURRENT_USER_CHANGED: 'current_user_changed',
        AUTHENTICATION_DONE: 'authentication_done',
    };
});
