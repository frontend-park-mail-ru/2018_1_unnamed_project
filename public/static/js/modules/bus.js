'use strict';

define('bus', (require) => {
    // Шина системных сообщений.

    const EventBus = require('EventBus');

    return new EventBus();
});
