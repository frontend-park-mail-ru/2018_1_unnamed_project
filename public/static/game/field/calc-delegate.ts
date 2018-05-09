import {PlayersCount} from "../players-count";

export class CalcDelegate {
    public fieldDim;
    public playersCount: number;

    /**
     * @param {Number} playersCount
     */
    constructor(playersCount: number = 2) {
        this.playersCount = playersCount;
        this.fieldDim = {
            TWO_PLAYERS: 10,
            THREE_PLAYERS: 15,
            FOUR_PLAYERS: 20,
        };
    }

    /**
     * Рассчитывает параметры поля.
     * @return {{dim: number, size: number}}
     */
    get gameFieldParams() {
        let fieldDim = 0;

        switch (this.playersCount) {
            case PlayersCount.TwoPlayers:
                fieldDim = this.fieldDim.TWO_PLAYERS;
                break;
            case PlayersCount.ThreePlayers:
                fieldDim = this.fieldDim.THREE_PLAYERS;
                break;
            case PlayersCount.FourPlayers:
                fieldDim = this.fieldDim.FOUR_PLAYERS;
                break;
            default:
                throw new Error('Invalid players count');
        }

        return {
            dim: fieldDim,
            size: fieldDim * fieldDim,
        };
    }
}
