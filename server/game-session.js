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
    // Сделать сцену активной для игрока. payload = {}.
    // Генерится, когда челик должен ходить, не важно, начало или середина игры.
    ENABLE_SCENE: 'enable_scene',
    // Запросить разрешения на ход. payload: {cell: {i: 1, j: 2}}
    REQUEST_GAME_PERMISSION: 'request_game_permission',
    // Сказать клиенту, как нарисовать клетку. payload = {status: CELL_STATUS}
    DRAW: 'draw',
    // Сказать клиенту, сколько очков установить. payload = {score: 100500}
    SET_SCORE: 'set_score',
    // Сообщение для вывода в push-уведомлениях. payload = {level: 'error|warning|info|success', message: 'message'}
    GAME_MESSAGE: 'game_message',
    // Сообщение на присоединение к игре. payload = {count: 3, field: [[], [], ...]}
    JOIN_GAME: 'join_game',
    // Сообщение о том, что игра начата. Должны получать все игроки, чтобы прекратить
    // показывать состояние "ожидание подключения".
    GAME_STARTED: 'game_started',
    // Сообщение о том, что игра закончилась.
    // payload = {win: true|false, score: 2, scoreboard: {username: score, username: score, ...}
    GAME_OVER: 'game_over',
};

const GameMessageLevels = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SUCCESS: 'success',
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
        if (!FieldDim[playersCount]) {
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
        return !!this._currentStepExpires;
    }

    /**
     * @return {boolean}
     */
    get gameIsOver() {
        const players = [...this._players.values()];
        return players.filter((p) => p.shipsAliveCount !== 0).length === 1;
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

        // Вызывается для увеличения _currentPlayerIdx.
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
            if (this.gameIsOver) {
                return this;
            }

            this._wsService.send({
                forConnection: this.currentPlayer.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: GameMessageLevels.INFO,
                    message: 'Время хода истекло, ходят другие игроки',
                },
            });

            do {
                this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._playersCount;
            } while (!this.currentPlayer.shipsAliveCount);

            this._wsService.send({
                forConnection: this.currentPlayer.uuid,
                type: MessageTypes.ENABLE_SCENE,
                payload: {},
            });

            this._currentStepExpires = (+ new Date()) + SECONDS_TO_MOVE;
        } else {
            this._currentPlayerIdx = (this._currentPlayerIdx + 1) % this._playersCount;
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
                    level: GameMessageLevels.ERROR,
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
                        level: GameMessageLevels.ERROR,
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
                if (current.uuid === player.uuid) {
                    moveResult.isDestroyedSelf = true;

                    moveResult.messages.push({
                        forConnection: current.uuid,
                        type: MessageTypes.GAME_MESSAGE,
                        payload: {
                            level: GameMessageLevels.ERROR,
                            message: `Игрок ${player.username} попал по вам!`,
                        },
                    });
                    moveResult.messages.push({
                        forConnection: current.uuid,
                        type: MessageTypes.DRAW,
                        payload: {
                            i,
                            j,
                            status: current.field[i][j],
                        },
                    });
                }

                current.field[i][j] = CellStatus.DESTROYED;
                player.field[i][j] = CellStatus.DESTROYED_OTHER;

                current.shipsAliveCount -= 1;
                moveResult.destroyedShipsCount++;

                break;
            case CellStatus.EMPTY:
                player.field[i][j] = CellStatus.MISSED;
                break;
            default:
                break;
            }
        }

        if (moveResult.isDestroyedSelf && player.field[i][j] !== CellStatus.DESTROYED_OTHER) {
            player.field[i][j] = CellStatus.DESTROYED;
        }

        if (!moveResult.destroyedShipsCount) {
            player.field[i][j] = CellStatus.MISSED;
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

        this._players.forEach((p) => {
            this._wsService.send({
                forConnection: p.uuid,
                type: MessageTypes.GAME_STARTED,
                payload: {},
            });
        });

        this._wsService.send({
            forConnection: this.currentPlayer.uuid,
            type: MessageTypes.ENABLE_SCENE,
            payload: {},
        });

        // https://stackoverflow.com/a/221297
        this._currentStepExpires = (+ new Date()) + SECONDS_TO_MOVE;
    }

    /**
     * Проверяем каждый тик, что время хода текущего игрока еще не истекло.
     * Если истекло, то делаем текущим следующего игрока.
     */
    syncStep() {
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
                    level: GameMessageLevels.ERROR,
                    message: 'Вы попали только по себе. Дизлайк, отписка :(',
                },
            });

            const players = [...this._players.values()];
            players.map((p) => p.id).filter((id) => id !== player.uuid).forEach((id) => {
                moveResult.messages.push({
                    forConnection: id,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: GameMessageLevels.INFO,
                        message: `Игрок ${player.username} попал только по себе`,
                    },
                });
            });
        } else if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount) {
            const scoreIncrease = 2 * moveResult.destroyedShipsCount;
            player.score += scoreIncrease;

            moveResult.messages.push(...[
                {
                    forConnection: player.uuid,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: GameMessageLevels.SUCCESS,
                        message: `Кораблей поражено: ${moveResult.destroyedShipsCount}, очков +${scoreIncrease}`,
                    },
                },
                {
                    forConnection: player.uuid,
                    type: MessageTypes.SET_SCORE,
                    payload: {
                        score: player.score,
                    },
                },
            ]);
        } else if (moveResult.destroyedShipsCount) {
            player.score += moveResult.destroyedShipsCount;
            moveResult.messages.push(...[
                {
                    forConnection: player.uuid,
                    type: MessageTypes.GAME_MESSAGE,
                    payload: {
                        level: 'success',
                        message: `Кораблей поражено: ${moveResult.destroyedShipsCount}`,
                    },
                },
                {
                    forConnection: player.uuid,
                    type: MessageTypes.SET_SCORE,
                    payload: {
                        score: player.score,
                    },
                },
            ]);
        } else {
            moveResult.messages.push({
                forConnection: player.uuid,
                type: MessageTypes.GAME_MESSAGE,
                payload: {
                    level: 'warning',
                    message: 'Вы никуда не попали',
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
        if (!this.gameIsStarted) {
            return;
        }

        this._players.forEach((p) => {
            const win = !!p.shipsAliveCount;
            const scoreboard = [...this._players].sort((a, b) => a.score - b.score);
            this._wsService.send({
                forConnection: p.uuid,
                type: MessageTypes.GAME_OVER,
                payload: {
                    win,
                    score: p.score,
                    scoreboard,
                },
            });
        });

        this._currentStepExpires = 0;
    }
}

module.exports = {
    CellStatus,
    GameSession,
    MessageTypes,
};
