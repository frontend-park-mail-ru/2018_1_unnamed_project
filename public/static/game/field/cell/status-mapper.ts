import {CellStatus} from "./status";

enum Color {
    Black = '#000000',
    Grey = '#B0B0B0',
    White = '#FFFFFF',
    DarkerGrey = '#4F4F4F',
    PrimaryRed = '#FF98B1',
    DarkerRed = '#B23553',
    AlmostPink = '#EF476F',
    Yellow = '#FFCD1F',
    SmokerYellow = '#D6A31A',
}

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
                        borderColor: Color.Grey,
                        fillColor: Color.DarkerGrey,
                    },
                    enabled: {
                        borderColor: Color.White,
                        fillColor: Color.Black,
                    },
                };
            case CellStatus.Busy:
                return {
                    disabled: {
                        borderColor: Color.Grey,
                        fillColor: Color.Grey,
                    },
                    enabled: {
                        borderColor: Color.White,
                        fillColor: Color.White,
                    },
                };
            case CellStatus.Destroyed:
                return {
                    disabled: {
                        borderColor: Color.DarkerRed,
                        fillColor: Color.DarkerRed,
                    },
                    enabled: {
                        borderColor: Color.AlmostPink,
                        fillColor: Color.AlmostPink,
                    },
                };
            case CellStatus.DestroyedOther:
                return {
                    disabled: {
                        borderColor: Color.DarkerRed,
                        fillColor: Color.DarkerRed,
                    },
                    enabled: {
                        borderColor: Color.DarkerRed,
                        fillColor: Color.DarkerRed,
                    },
                };
            case CellStatus.Missed:
                return {
                    disabled: {
                        borderColor: Color.SmokerYellow,
                        fillColor: Color.SmokerYellow,
                    },
                    enabled: {
                        borderColor: Color.Yellow,
                        fillColor: Color.Yellow,
                    },
                };
            default:
                return null;
        }
    }

    static mapHover(cellStatus) {
        switch (cellStatus) {
            case CellStatus.Busy:
                return {
                    enabled: {
                        borderColor: Color.PrimaryRed,
                        fillColor: Color.PrimaryRed,
                    },
                    disabled: {
                        borderColor: Color.PrimaryRed,
                        fillColor: Color.PrimaryRed,
                    },
                };
            case CellStatus.Empty:
                return {
                    enabled: {
                        borderColor: Color.PrimaryRed,
                        fillColor: Color.PrimaryRed,
                    },
                    disabled: {
                        borderColor: Color.PrimaryRed,
                        fillColor: Color.PrimaryRed,
                    },
                };
            default:
                return null;
        }
    }
}
