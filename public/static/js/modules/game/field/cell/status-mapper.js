'use strict';

define('game/cell/StatusMapper', (require) => {
    const CellStatus = require('game/cell/status');

    return class StatusMapper {
        /**
         * Отображает статус ячейки в цвета для отрисовки.
         * @param {Number} cellStatus
         * @return {*}
         */
        static mapStatus(cellStatus) {
            switch (cellStatus) {
            case CellStatus.EMPTY:
                return {
                    enabled: {
                        borderColor: '#FFFFFF',
                        fillColor: '#000000',
                    },
                    disabled: {
                        borderColor: '#B0B0B0',
                        fillColor: '#4F4F4F',
                    },
                };
            case CellStatus.BUSY:
                return {
                    enabled: {
                        borderColor: '#FFFFFF',
                        fillColor: '#FFFFFF',
                    },
                    disabled: {
                        borderColor: '#B0B0B0',
                        fillColor: '#B0B0B0',
                    },
                };
            case CellStatus.DESTROYED:
                return {
                    enabled: {
                        borderColor: '#EF476F',
                        fillColor: '#EF476F',
                    },
                    disabled: {
                        borderColor: '#B23553',
                        fillColor: '#B23553',
                    },
                };
            case CellStatus.DESTROYED_OTHER:
                return {
                    enabled: {
                        borderColor: '#B23553',
                        fillColor: '#B23553',
                    },
                    disabled: {
                        borderColor: '#B23553',
                        fillColor: '#B23553',
                    },
                };
            case CellStatus.MISSED:
                return {
                    enabled: {
                        borderColor: '#FFCD1F',
                        fillColor: '#FFCD1F',
                    },
                    disabled: {
                        borderColor: '#D6A31A',
                        fillColor: '#D6A31A',
                    },
                };
            default:
                return null;
            }
        }
    };
});
