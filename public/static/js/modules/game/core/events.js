'use strict';

define('game/core/events', (require) => {
    return {
        CREATE_BATTLEFIELD: 'create_battlefield',
        APPROVE: 'approve',
        DRAW: 'draw',
        ENABLE_SCENE: 'enable_scene',
        DISABLE_SCENE: 'disable_scene',
        LCLICK: 'lclick',
        RCLICK: 'rclick',
        REQUEST_GAME_PERMISSION: 'game_permission',
        REQUEST_SETUP_PERMISSION: 'setup_permission',
        REQUEST_FREE_PERMISSION: 'remove_permission',
        SETUP_TIMEOUT: 'setup_timeout',
        START_OFFLINE_GAME: 'start_offline_game',
        OFFLINE_OPPONENTS_COUNT_SELECTED: 'offline_opponents_count_selected',
        ONLINE_OPPONENTS_COUNT_SELECTED: 'online_opponents_count_selected',
    };
});
