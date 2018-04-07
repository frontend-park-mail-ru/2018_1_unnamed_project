'use strict';

define('game/cell/status', (require) => {
    // enabled/disabled показывает, какими цветами отрисовываются клетки на
    // активном и неактивном игровом поле.
    return {
        // Пустая клетка.
        EMPTY: {
            enabled: {
                borderColor: '#FFFFFF',
                fillColor: '#000000',
            },
            disabled: {
                borderColor: '#B0B0B0',
                fillColor: '#4F4F4F',
            },
        },
        // В клетке стоит корабль.
        BUSY: {
            enabled: {
                borderColor: '#FFFFFF',
                fillColor: '#FFFFFF',
            },
            disabled: {
                borderColor: '#B0B0B0',
                fillColor: '#B0B0B0',
            },
        },
        // В клетку игрока попали.
        DESTROYED: {
            enabled: {
                borderColor: '#EF476F',
                fillColor: '#EF476F',
            },
            disabled: {
                borderColor: '#B23553',
                fillColor: '#B23553',
            },
        },
        // Игрок промахнулся.
        MISSED: {
            enabled: {
                borderColor: '#FFCD1F',
                fillColor: '#FFCD1F',
            },
            disabled: {
                borderColor: '#D6A31A',
                fillColor: '#D6A31A',
            },
        },
    };
});
