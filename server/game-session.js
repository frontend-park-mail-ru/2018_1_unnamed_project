const WSService = require('./ws-service.js');

const CellStatus = {
    EMPTY: 0,
    BUSY: 1,
    DESTROYED: 2,
    DESTROYED_OTHER: 3,
    MISSED: 4,
};

const FieldDim = {
    2: 10,
    3: 15,
    4: 20,
};

const MessageTypes = {
    START_GAME: 'START_GAME',
    MOVE_ENABLED: 'MOVE_ENABLED',
    MAKE_MOVE: 'MAKE_MOVE',
    MOVE_RESULT: 'MOVE_RESULT',
    DRAW_CELL: 'DRAW_CELL',
    GAME_MESSAGE: 'GAME_MESSAGE',
    GAME_OVER: 'GAME_OVER',
    JOIN_GAME: 'JOIN_GAME',
};

/**
 * Валидации размера поля только по первому измерению.
 * Верим пользователю на слово, что поле квадратное.
 */

const SECONDS_TO_MOVE = 20;

/**
 * Игровая сессия.
 */
class GameSession {
    /**
     * @param {number} playersCount
     */
    constructor(playersCount) {
        if (![2, 3, 4].includes(playersCount)) {
            throw new Error('Неверное количество игроков');
        }

        this._fieldDim = FieldDim[playersCount];
        this._playersCount = playersCount;
        this._players = new Map();
        this._playerUuids = [];
        this._currentPlayerIdx = 0;
        this._wsService = new WSService();

        this._currentStepExpires = 0;
    }

    /**
     * Возвращает ссылку на игрока, который ходит.
     * @return {V | undefined}
     */
    get currentPlayer() {
        return this._players.get(this._playerUuids[this._currentPlayerIdx]);
    }

    /**
     * Флаг того, что игра в процессе.
     * @return {boolean}
     */
    get gameIsFilled() {
        return this._playersCount === this._players.size;
    }

    /**
     * @return {boolean}
     */
    get gameIsStarted() {
        return this._currentStepExpires !== 0;
    }

    /**
     * @return {boolean}
     */
    get gameIsOver() {
        return this._players.values().filter((p) => p.shipsAliveCount !== 0).length === 1;
    }

    /**
     * @param {string} uuid
     * @param {object} player
     * @param {object} ws
     * @return {GameSession}
     */
    addPlayer(uuid, player, ws) {
        if (this._players.size === this._playersCount) {
            return this;
        }

        if (player.field.length !== this._fieldDim) {
            throw new Error('Размер поля игрока не соответствует ожидаемому');
        }

        player.uuid = uuid;
        player.score = 0;

        const sum = (acc, val) => acc + val;
        player.shipsAliveCount = player.field.map((x) => x.reduce(sum)).reduce(sum);

        this._players.set(uuid, player);
        this._playerUuids.push(uuid);
        this._wsService.addConnection(uuid, ws);

        this.toNextPlayer();

        return this;
    }

    /**
     * Передает ход следующему игроку.
     * Этот метод использует механика, которая тикает и после 20 с говорит, что теперь ходит следующий
     * и так по кругу, пока не конец игры.
     * @return {GameSession}
     */
    toNextPlayer() {
        if (this.gameIsStarted) {
            this._wsService.send({
                forConnection: this.currentPlayer.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'info',
                    message: 'Время хода истекло, ходят другие игроки',
                },
            });
        }

        // TODO: проверять, остались ли корабли.
        this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._playersCount;

        if (this.gameIsStarted) {
            this._wsService.send({
                forConnection: this.currentPlayer.uuid,
                type: MessageTypes.MOVE_ENABLED,
                payload: {},
            });

            this._currentStepExpires = (+ new Date()) + SECONDS_TO_MOVE;
        }

        return this;
    }

    /**
     * @param {object} player
     * @param {number} i
     * @param {number} j
     * @return {boolean}
     */
    checkMove(player, i, j) {
        if (i >= this._fieldDim || j >= this._fieldDim) {
            this._wsService.send({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'error',
                    message: 'Такой клетки нет на поле',
                },
            });
        } else {
            switch (player.field[i][j]) {
            case CellStatus.EMPTY:
            case CellStatus.BUSY:
                return true;
            default:
                this._wsService.send({
                    forConnection: player.uuid,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: 'error',
                        message: 'Выбранная клетка недоступна для выстрела',
                    },
                });
            }
        }

        return false;
    }

    /**
     * @param {object} player
     * @param {number} i
     * @param {number} j
     * @return {{isDestroyedSelf: boolean, destroyedShipsCount: number, messages: Array}}
     */
    getMoveResult(player, i, j) {
        const moveResult = {
            isDestroyedSelf: false,
            destroyedShipsCount: 0,
            messages: [],
        };

        for (const current of this._players) {
            switch (current.field[i][j]) {
            case CellStatus.BUSY:
                current.field[i][j] = CellStatus.DESTROYED;
                moveResult.messages.push({
                    forConnection: current.uuid,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: 'error',
                        message: `Игрок ${player.username} попал по вам!`,
                    },
                });
                moveResult.messages.push({
                    forConnection: current.uuid,
                    type: MessageTypes.DRAW_CELL,
                    payload: {
                        status: current.field[i][j],
                    },
                });

                player.field[i][j] = CellStatus.DESTROYED_OTHER;

                current.shipsAliveCount -= 1;

                if (current.uuid === player.uuid) {
                    moveResult.isDestroyedSelf = true;
                } else {
                    moveResult.destroyedShipsCount++;
                }

                break;
            case CellStatus.EMPTY:
                player.field[i][j] = CellStatus.MISSED;
                break;
            default:
                break;
            }
        }

        return moveResult;
    }

    /**
     *
     */
    startGame() {
        if (this.gameIsStarted) {
            return;
        }

        this._wsService.send({
            forConnection: this.currentPlayer.uuid,
            type: MessageTypes.START_GAME,
            payload: {},
        });

        // https://stackoverflow.com/a/221297
        this._currentStepExpires = (+ new Date()) + SECONDS_TO_MOVE;
    }

    /**
     *
     */
    syncStep() {
        // https://stackoverflow.com/a/221297
        const currentTs = + new Date();

        if (currentTs >= this._currentStepExpires) {
            this.toNextPlayer();
        }
    }

    /**
     * @param {object} player
     * @param {object} moveResult
     */
    resolveMoveResult(player, moveResult) {
        if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount === 0) {
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'error',
                    message: 'Вы попали только по себе. Дизлайк, отписка :(',
                },
            });
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.DRAW_CELL,
                payload: {
                    status: CellStatus.DESTROYED,
                },
            });
            this._players.map((p) => p.id).filter((id) => id !== player.uuid).forEach((id) => {
                moveResult.messages.push({
                    forConnection: id,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: 'info',
                        message: `Игрок ${player.username} попал только по себе`,
                    },
                });
            });
        } else if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount) {
            const scoreIncrease = 2 * moveResult.destroyedShipsCount;
            player.score += scoreIncrease;
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'success',
                    message: `Кораблей поражено: ${moveResult.destroyedShipsCount}, очков +${scoreIncrease}`,
                },
            });
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.DRAW_CELL,
                payload: {
                    status: CellStatus.DESTROYED_OTHER,
                },
            });
        } else if (moveResult.destroyedShipsCount) {
            player.score += moveResult.destroyedShipsCount;
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'success',
                    message: `Кораблей поражено: ${moveResult.destroyedShipsCount}`,
                },
            });
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.DRAW_CELL,
                payload: {
                    status: CellStatus.DESTROYED_OTHER,
                },
            });
        } else {
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'warning',
                    message: 'Вы никуда не попали',
                },
            });
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.DRAW_CELL,
                payload: {
                    status: CellStatus.MISSED,
                },
            });
        }

        this._wsService.sendAll(moveResult.messages);
    }

    /**
     * Вызывается после того, как игрок сделал ход.
     * @param {string} playerUuid
     * @param {object} cellCoords
     * @return {GameSession}
     */
    makeMove(playerUuid, cellCoords) {
        if (!this._playerUuids.includes(playerUuid) || playerUuid !== this.currentPlayer.uuid) {
            return this;
        }

        const player = this._players.get(playerUuid);
        const {i, j} = cellCoords;

        if (!this.checkMove(player, i, j)) {
            return this;
        }

        const moveResult = this.getMoveResult(player, i, j);
        this.resolveMoveResult(player, moveResult);

        return this;
    }

    /**
     *
     */
    endGame() {
        this._players.forEach((p) => {
            const message = (p.shipsAliveCount) ? 'Победа!' : 'Вы проиграли';
            this._wsService.send({
                forConnection: p.uuid,
                type: MessageTypes.GAME_OVER,
                payload: {
                    message,
                },
            });
        });
    }
}

module.exports = {
    CellStatus,
    GameSession,
    MessageTypes,
};
