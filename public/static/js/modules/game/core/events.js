'use strict';

define('game/core/events', (require) => {
    return {
        APPROVE: 'approve',
        DRAW: 'draw',
        ENABLE_SCENE: 'enable_scene',
        DISABLE_SCENE: 'disable_scene',
        LCLICK: 'lclick',
        RCLICK: 'rclick',
        REQUEST_GAME_PERMISSION: 'game_permission',
        REQUEST_SETUP_PERMISSION: 'setup_permission',
        REQUEST_REMOVE_PERMISSION: 'remove_permission',
        SETUP_TIMEOUT: 'setup_timeout',
    };
});
