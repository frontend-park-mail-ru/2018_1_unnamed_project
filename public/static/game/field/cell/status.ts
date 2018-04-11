export enum CellStatus {
    // Пустая клетка.
    Empty = 0,
    // В клетке стоит корабль.
    Busy = 1,
    // В клетку игрока попали.
    Destroyed = 2,
    // Игрок попал в клетку другого игрока.
    DestroyedOther = 3,
    // Игрок промахнулся.
    Missed = 4,
}
