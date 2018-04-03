'use strict';

define('User/events', (require) => {
    /**
     * События которые может генерировать модель пользователя.
     */
    return {
        CURRENT_USER_CHANGED: 'current_user_changed',
        AUTHENTICATION_DONE: 'authentication_done',
    };
});
