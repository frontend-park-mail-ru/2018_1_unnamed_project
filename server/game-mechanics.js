const uuid = require('uuid/v1');

const {GameSession} = require('./game-session.js');

/**
 * Игровая механика.
 */
class GameMechanics {
    /**
     *
     */
    constructor() {
        this._gameSessions = new Map();
        this._waiters = new Map([[2, []], [3, []], [4, []]]);
    }

    /**
     * @param {number} wantedPlayersCount
     * @param {{uuid: string, player: object, ws: object}} playerHandle
     * @return {*}
     */
    addWaiter(wantedPlayersCount, playerHandle) {
        if (!this._waiters.has(wantedPlayersCount)) {
            return;
        }

        this._waiters.get(wantedPlayersCount).push(playerHandle);
        return this;
    }

    /**
     *
     */
    tryStartGames() {
        this._waiters.forEach((waitersQueue, wantedPlayersCount) => {
            while (waitersQueue.size >= wantedPlayersCount) {
                const gs = new GameSession(wantedPlayersCount);
                const gsUuid = uuid();

                while (!gs.gameIsFilled) {
                    const {uuid, player, ws} = waitersQueue.pop();
                    gs.addPlayer(uuid, player, ws);
                    player.gsUuid = gsUuid;
                }

                this._gameSessions.set(gsUuid, gs);
                gs.startGame();
            }
        });
    }

    /**
     *
     */
    gmStep() {
        this._gameSessions.forEach((gs) => {
            if (gs.gameIsStarted) {
                gs.syncStep();
            }
        });
        this._gameSessions.forEach((gs, uuid) => {
            if (gs.gameIsOver) {
                gs.endGame();
                this._gameSessions.delete(uuid);
            }
        });

        this.tryStartGames();
    }

    /**
     * @param {object} player
     * @param {object} cellCoords
     */
    makeMove(player, cellCoords) {
        if (!this._gameSessions.has(player.gsUuid)) {
            return;
        }

        this._gameSessions.get(player.gsUuid).makeMove(player.uuid, cellCoords);
    }
}

module.exports = GameMechanics;
