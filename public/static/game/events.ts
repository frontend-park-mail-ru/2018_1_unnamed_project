export enum GameEvents {
    CreateBattlefield = 'create_battlefield',
    DisableScene = 'disable_scene',
    EnableScene = 'enable_scene',
    Draw = 'draw',
    LClick = 'lclick',
    RClick = 'rclick',
    RequestGamePermission = 'request_game_permission',
    RequestSetupPermission = 'request_setup_permission',
    RequestFreePermission = 'request_free_permission',
    SetupTimeout = 'setup_timeout',
    OfflineComponentsCountSelected = 'offline_opponents_count_selected',
    OnlineComponentsCountSelected = 'online_opponents_count_selected',
    SetScore = 'set_score',
    Terminate = 'terminate',
    EndOfGame = 'end_of_game',
}
