'use strict';

define('game/core/bus', (require) => {
    // Шина сообщений игры.

    const EventBus = require('EventBus');

    return new EventBus();
});
