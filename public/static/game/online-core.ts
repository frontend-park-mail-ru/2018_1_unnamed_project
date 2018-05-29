import {PushLevels} from '../components/message-container';
import {WS} from '../modules/ws';
import {Core, GameFieldData} from './core';
import {IPlayer, MAX_SECONDS_TO_MOVE} from './datatypes';
import {GameEvents} from './events';
import {CellStatus} from './field/cell/status';
import {SetupValidator} from './field/setup-validator';
import gameBus from './game-bus';
import {MoveTimeHandler} from './move-time-hanlder';

export class OnlineCore extends Core {
    private _player: IPlayer;

    private _ws: WS;

    private _moveTimeHandler: MoveTimeHandler;
    private _lastInterval;
    private _moveTimeCounter;

    private _waiting: boolean;
    private _userMove: boolean;

    constructor() {
        super();

        this._ws = new WS();
        this._moveTimeHandler = new MoveTimeHandler();

        this._lastInterval = null;
        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
    }

    start(username: string, gameField: GameFieldData, playersCount: number) {
        gameBus.emit(GameEvents.DisableScene);

        const shipsLimit = SetupValidator.computeShipsLimit(gameField.length);

        this._player = {
            username,
            gameField,
            score: 0,
            shipsAliveCount: shipsLimit,
        };
        this._waiting = true;
        this._userMove = false;

        // Перенаправление сообщений бекенду.
        gameBus.on(GameEvents.RequestGamePermission, ({i, j}) => {
            gameBus.emit(GameEvents.DisableScene);
            this._ws.sendMessage(GameEvents.RequestGamePermission, {cell: {i, j}});
        });

        // Отрисовка сообщение бекенда.
        gameBus.on(GameEvents.GameMessage, ({level, message}) => {
            this.push.clear();
            this.push.addMessage(message);
            this.push.render({level});
        });

        // Обновление состояния поля.
        gameBus.on(GameEvents.Draw, ({i, j, status}) => {
            gameBus.emit(GameEvents.DisableScene);
            this._player.gameField[i][j] = status as CellStatus;
        });

        // Состояние
        gameBus.on(GameEvents.EnableScene, () => {
            this._waiting = false;
            this._userMove = true;

            this.push.clear();
            this.push.addMessage('Ваш ход');
            this.push.render({level: PushLevels.Success});

            this.runMoveTimer();
        });

        this.push.clear();
        this.push.addMessage('Ожидаю подключения игроков...');
        this.push.render();

        // Если слишком долго никого нет, покажем сообщение.
        setTimeout(() => {
            if (this._waiting) {
                this.push.clear();
                this.push.addMessage('Никто не хочет присоединяться, скорее всего произошла ошибка :(');
                this.push.render({level: PushLevels.Error});
            }
        }, 20000);
    }

    private runMoveTimer() {
        this._moveTimeCounter = MAX_SECONDS_TO_MOVE;
        this._lastInterval = setInterval(() => {
            if (--this._moveTimeCounter) {
                MoveTimeHandler.renderProgress(this._moveTimeCounter);
            } else {
                clearInterval(this._lastInterval);
            }
        }, 1000);
    }
}
