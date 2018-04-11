import {PushLevels} from "../components/push/push";
import {GameBot} from "./bots/bot";
import {Core, GameFieldData} from "./core";
import {GameEvents} from "./events";
import {CellStatus} from "./field/cell/status";
import {SetupValidator} from "./field/setup-validator";
import gameBus from "./game-bus";
import {MoveTimeHandler} from "./move-time-hanlder";

const BOT_MOVE_SECONDS = 1;
const MAX_SECONDS_TO_MOVE = 20;

interface IPlayer {
    username: string;
    gameField: GameFieldData;
    score: number;
    shipsAliveCount: number;
    isUser: boolean;
    bot?: GameBot;
}

type PlayersArray = IPlayer[];

interface IMoveResult {
    isUserMove: boolean;
    isUserHit: boolean;
    isDestroyedSelf: boolean;
    destroyedShipsCount: number;
}

export class OfflineCore extends Core {
    private _players: PlayersArray;

    private _player: IPlayer;
    private _bots: PlayersArray;

    private _moveTimeHandler: MoveTimeHandler;
    private _lastTimeout;
    private _moveTimeCounter: number;
    private _moveEnabled: boolean;
    private _userMoveInProgress: boolean;

    /**
     *
     */
    constructor() {
        super();

        this._players = [];

        this._moveTimeHandler = new MoveTimeHandler();

        this._lastTimeout = null;
        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        this._moveEnabled = true;
        this._userMoveInProgress = false;
    }

    /**
     * Игра заканчивается, когда только у одного игрока есть "живые" корабли.
     * @return {boolean}
     */
    isEndOfGame() {
        return this._player.shipsAliveCount === 0 ||
            this._players.filter((p) => p.shipsAliveCount !== 0).length === 1;
    }

    /**
     * Управляет рендерингом сообщения об окончании игры.
     */
    emitEndOfGame() {
        this.push.clear();

        const message = (this._player.shipsAliveCount) ? 'Вы выиграли!' : 'Вы проиграли (в голос) :(';

        const scoreboard = this._players.map((p) => {
            return {username: p.username, rank: p.score};
        }).sort((a, b) => a.rank - b.rank);

        gameBus.emit(GameEvents.EndOfGame, {scoreboard, message});
        console.log('EOG');
    }

    /**
     * Ход игрока.
     * @private
     */
    beginUserMove() {
        if (this._userMoveInProgress) return;

        const secPassed = () => {
            this._moveTimeCounter--;

            if (this._moveTimeCounter > 0) {
                this._moveTimeHandler.renderProgress(this._moveTimeCounter);
                this._userMoveInProgress = true;
                this._lastTimeout = setTimeout(secPassed, 1000);
            } else {
                this._userMoveInProgress = false;
                this.push.clear();
                this.doBotsMove();
            }
        };

        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        this._moveTimeHandler.renderProgress(this._moveTimeCounter);
        this._userMoveInProgress = true;
        this._lastTimeout = setTimeout(secPassed, 1000);
    }

    /**
     * Заканчивает ход пользователя (когда он уложился в срок).
     * @param {Number} i
     * @param {Number} j
     */
    endUserMove({i, j}) {
        gameBus.emit(GameEvents.DisableScene);

        this._moveEnabled = false;
        this._userMoveInProgress = false;

        if (this.resolveMove({i, j, player: this._player})) {
            if (this._lastTimeout) {
                clearTimeout(this._lastTimeout);
                this._lastTimeout = null;
            }

            if (this.isEndOfGame()) {
                this.emitEndOfGame();
                return;
            }

            setTimeout(() => this.doBotsMove(), BOT_MOVE_SECONDS * 1000);
        } else {
            gameBus.emit(GameEvents.EnableScene);
            this._moveEnabled = true;
        }
    }

    /**
     * Ходы ботов
     * @private
     */
    doBotsMove() {
        gameBus.emit(GameEvents.DisableScene);

        if (this._lastTimeout) {
            clearTimeout(this._lastTimeout);
            this._lastTimeout = null;
        }

        let currentBotIdx = 0;

        const renderBotMove = () => {
            this.push.addMessage(`Игрок ${this._bots[currentBotIdx].username} ходит`);
            this.push.render({level: PushLevels.Info});
        };

        const botMove = () => {
            const current = this._bots[currentBotIdx];
            const [i, j] = current.bot.makeMove();
            this.resolveMove({i, j, player: current});

            setTimeout(() => {
                if (++currentBotIdx < this._bots.length) {
                    if (this.isEndOfGame()) {
                        this.emitEndOfGame();
                        return;
                    }

                    renderBotMove();
                    setTimeout(botMove, BOT_MOVE_SECONDS * 1000);
                } else {
                    gameBus.emit(GameEvents.EnableScene);
                    this._moveEnabled = true;
                    this.beginUserMove();
                }
            }, BOT_MOVE_SECONDS * 1000);
        };

        renderBotMove();
        setTimeout(botMove, BOT_MOVE_SECONDS * 1000);
    }

    /**
     * Проверяет, что сюда можно ходить.
     * @param {Number} i
     * @param {Number} j
     * @param {Object} player
     * @return {boolean}
     */
    checkMoveCorrect({i, j, player}): boolean {
        const gameFieldDim = player.gameField.length;

        if (i >= gameFieldDim || j >= gameFieldDim) {
            this.push.addMessage('Такой клетки нет на поле');
        } else {
            const cellStatus = player.gameField[i][j];

            switch (cellStatus) {
                case CellStatus.Empty:
                case CellStatus.Busy:
                    return true;
                default:
                    this.push.addMessage('Эта клетка недоступна для выстрела');
                    break;
            }
        }

        this.push.render({level: PushLevels.Error});
        return false;
    }

    /**
     * Отдает результат хода (в кого попали, сколько раз, задели ли себя и т.п.).
     * @param {Number} i
     * @param {Number} j
     * @param {Object} player
     * @return {{}}
     */
    getMoveResult({i, j, player}): IMoveResult {
        const moveResult: IMoveResult = {
            isUserMove:          player.username === this._player.username,
            isUserHit:           false,
            isDestroyedSelf:     false,
            destroyedShipsCount: 0,
        };

        for (const current of this._players) {
            switch (current.gameField[i][j]) {
                case CellStatus.Busy:
                    current.gameField[i][j] = CellStatus.Destroyed;
                    player.gameField[i][j] = CellStatus.DestroyedOther;

                    current.shipsAliveCount -= 1;

                    if (current.username === player.username) {
                        moveResult.isDestroyedSelf = true;
                    } else {
                        moveResult.destroyedShipsCount++;
                    }

                    if (current.username === this._player.username) {
                        moveResult.isUserHit = true;
                    }

                    break;
                case CellStatus.Empty:
                    player.gameField[i][j] = CellStatus.Missed;
                    break;
                default:
                    break;
            }
        }

        return moveResult;
    }

    /**
     * Дает фидбек по ходу.
     * @param {Number} i
     * @param {Number} j
     * @param {Object} player
     * @return {boolean}
     */
    resolveMove({i, j, player}): boolean {
        if (!this.checkMoveCorrect({i, j, player})) {
            return false;
        }

        const moveResult = this.getMoveResult({i, j, player});

        let message = null;
        let level = null;
        let status = null;

        if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount === 0) {
            player.score -= 2;

            if (moveResult.isUserMove) {
                message = 'Вы попали только по себе. Дизлайк, отписка :(';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;

                gameBus.emit(GameEvents.SetScore, this._player.score);
            } else {
                message = `Игрок ${player.username} попал только по себе`;
                level = PushLevels.Warning;
            }
        } else if (moveResult.isDestroyedSelf && moveResult.destroyedShipsCount) {
            player.score += 2 * moveResult.destroyedShipsCount;

            if (moveResult.isUserMove) {
                message = `${moveResult.destroyedShipsCount} X 2, молодца!`;
                level = PushLevels.Success;
                status = CellStatus.DestroyedOther;
            } else if (moveResult.isUserHit) {
                this._player.score -= 1;
                message = 'По вам попали';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;
            } else {
                message = `Игрок ${player.username} выбил ${moveResult.destroyedShipsCount} X 2`;
                level = PushLevels.Info;
            }
        } else if (moveResult.destroyedShipsCount) {
            player.score += moveResult.destroyedShipsCount;

            if (moveResult.isUserMove) {
                message = `+${moveResult.destroyedShipsCount}`;
                level = PushLevels.Success;
                status = CellStatus.DestroyedOther;
            } else if (moveResult.isUserHit) {
                this._player.score -= 1;
                message = 'По вам попали';
                level = PushLevels.Error;
                status = CellStatus.Destroyed;
            } else {
                message = `Игрок ${player.username} выбил ${moveResult.destroyedShipsCount}`;
                level = PushLevels.Info;
            }
        } else {
            if (moveResult.isUserMove) {
                message = 'Вы никуда не попали';
                level = PushLevels.Info;
                status = CellStatus.Missed;
            } else {
                message = `Игрок ${player.username} никуда не попал`;
                level = PushLevels.Info;
            }
        }

        if (message && level) {
            this.push.addMessage(message);
            this.push.render({level});
        }

        if (status) {
            gameBus.emit(GameEvents.Draw, {i, j, status});
        }

        if (moveResult.isUserMove || moveResult.isUserHit) {
            gameBus.emit(GameEvents.SetScore, this._player.score);
        }

        return true;
    }

    start(username: string, gameField: GameFieldData, playersCount: number) {
        const shipsLimit = SetupValidator.computeShipsLimit(gameField.length);

        this._players = [
            {
                username,
                gameField,
                score:           0,
                shipsAliveCount: shipsLimit,
                isUser:          true,
            },
        ];

        for (let i = 0; i < playersCount - 1; i++) {
            const bot = new GameBot(gameField.length);
            const botGameField = bot.randomizeShips();

            this._players.push(
                {
                    username:        `Clone Trooper ${i + 1}`,
                    gameField:       botGameField,
                    score:           0,
                    shipsAliveCount: shipsLimit,
                    isUser:          false,
                    bot,
                },
            );
        }

        // Не бот.
        this._player = this._players[0];
        // Все боты.
        this._bots = this._players.slice(1);

        this.beginUserMove();

        gameBus.on(GameEvents.RequestGamePermission, ({i, j}) => {
            if (!this._moveEnabled) {
                console.log('no move you bastard');
                return;
            }

            this.endUserMove({i, j});
        });
    }
}