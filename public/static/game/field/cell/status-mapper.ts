import {CellStatus} from "./status";

export class StatusMapper {
    /**
     * Отображает статус ячейки в цвета для отрисовки.
     * @param {Number} cellStatus
     * @return {*}
     */
    static mapStatus(cellStatus) {
        enum colors {
            black = '#000000',
            grey = '#B0B0B0',
            white = '#FFFFFF',
            darkerGrey = '#4F4F4F',
            darkerRed = '#B23553',
            almostPink = '#EF476F',
            yellow = '#FFCD1F',
            smokerSyellow = '#D6A31A',
        }

        switch (cellStatus) {
            case CellStatus.Empty:
                return {
                    disabled: {
                        borderColor: colors.grey,
                        fillColor: colors.darkerGrey,
                    },
                    enabled: {
                        borderColor: colors.white,
                        fillColor: colors.black,
                    },
                };
            case CellStatus.Busy:
                return {
                    disabled: {
                        borderColor: colors.grey,
                        fillColor: colors.grey,
                    },
                    enabled: {
                        borderColor: colors.white,
                        fillColor: colors.white,
                    },
                };
            case CellStatus.Destroyed:
                return {
                    disabled: {
                        borderColor: colors.darkerRed,
                        fillColor: colors.darkerRed,
                    },
                    enabled: {
                        borderColor: colors.almostPink,
                        fillColor: colors.almostPink,
                    },
                };
            case CellStatus.DestroyedOther:
                return {
                    disabled: {
                        borderColor: colors.darkerRed,
                        fillColor: colors.darkerRed,
                    },
                    enabled: {
                        borderColor: colors.darkerRed,
                        fillColor: colors.darkerRed,
                    },
                };
            case CellStatus.Missed:
                return {
                    disabled: {
                        borderColor: colors.smokerSyellow,
                        fillColor: colors.smokerSyellow,
                    },
                    enabled: {
                        borderColor: colors.yellow,
                        fillColor: colors.yellow,
                    },
                };
            default:
                return null;
        }
    }
}
