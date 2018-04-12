import {CellStatus} from "./status";

export class StatusMapper {
    /**
     * Отображает статус ячейки в цвета для отрисовки.
     * @param {Number} cellStatus
     * @return {*}
     */
    static mapStatus(cellStatus) {
        switch (cellStatus) {
            case CellStatus.Empty:
                return {
                    disabled: {
                        borderColor: '#B0B0B0',
                        fillColor:   '#4F4F4F',
                    },
                    enabled:  {
                        borderColor: '#FFFFFF',
                        fillColor:   '#000000',
                    },
                };
            case CellStatus.Busy:
                return {
                    disabled: {
                        borderColor: '#B0B0B0',
                        fillColor:   '#B0B0B0',
                    },
                    enabled:  {
                        borderColor: '#FFFFFF',
                        fillColor:   '#FFFFFF',
                    },
                };
            case CellStatus.Destroyed:
                return {
                    disabled: {
                        borderColor: '#B23553',
                        fillColor:   '#B23553',
                    },
                    enabled:  {
                        borderColor: '#EF476F',
                        fillColor:   '#EF476F',
                    },
                };
            case CellStatus.DestroyedOther:
                return {
                    disabled: {
                        borderColor: '#B23553',
                        fillColor:   '#B23553',
                    },
                    enabled:  {
                        borderColor: '#B23553',
                        fillColor:   '#B23553',
                    },
                };
            case CellStatus.Missed:
                return {
                    disabled: {
                        borderColor: '#D6A31A',
                        fillColor:   '#D6A31A',
                    },
                    enabled:  {
                        borderColor: '#FFCD1F',
                        fillColor:   '#FFCD1F',
                    },
                };
            default:
                return null;
        }
    }
}
