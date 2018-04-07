'use strict';

define('game/field/CalcDelegate', (require) => {
    const PlayersEnum = require('game/players');

    /**
     * Класс для расчетов игрового поля.
     */
    return class CalcDelegate {
        /**
         * @param {Number} playersCount
         */
        constructor(playersCount) {
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
            case PlayersEnum.TWO_PLAYERS:
                fieldDim = this.fieldDim.TWO_PLAYERS;
                break;
            case PlayersEnum.THREE_PLAYERS:
                fieldDim = this.fieldDim.THREE_PLAYERS;
                break;
            case PlayersEnum.FOUR_PLAYERS:
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
    };
});
