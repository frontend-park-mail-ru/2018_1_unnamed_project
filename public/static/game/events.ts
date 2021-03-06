export enum GameEvents {
    CreateBattlefield = 'create_battlefield',
    DisableScene = 'disable_scene',
    EnableScene = 'EnableScene',
    Draw = 'draw',
    LClick = 'lclick',
    RClick = 'rclick',
    Hover = 'hover',
    Unhover = 'unhover',
    RequestGamePermission = 'RequestGamePermission',
    RequestSetupPermission = 'request_setup_permission',
    RequestFreePermission = 'request_free_permission',
    OfflineOpponentsCountSelected = 'offline_opponents_count_selected',
    OnlineOpponentsCountSelected = 'online_opponents_count_selected',
    SetScore = 'set_score',
    SetTimeLeft = 'set_time_left',
    SetShipsLeft = 'set_ships',
    SetShipsToPlace = 'set_ships_left',
    Terminate = 'terminate',
    GameStarted = 'GameStarted',
    GameOver = 'GameOver',
    JoinGame = 'JoinGame',
    GameMessage = 'GameMessage',
    ErrorMessage = 'ErrorMessage',
    MoveDone = 'MoveDone',
}
