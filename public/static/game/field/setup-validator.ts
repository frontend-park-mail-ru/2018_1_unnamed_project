import {Push, PushLevels} from "../../components/push/push";
import {GameEvents} from "../events";
import gameBus from "../game-bus";
import {CellStatus} from "./cell/status";

export class SetupValidator {
    /**
     * @param {Number} fieldSize
     * @return {Number} количество клеток на игрока
     */
    static computeShipsLimit(fieldSize) {
        switch (fieldSize) {
            case 10:
                return 10;
            case 15:
                return 30;
            case 20:
                return 40;
            default:
                return 10;
        }
    }

    private _battlefield;
    private _push;
    private _setupStarted;
    private _setupFinished;
    private _shipsLimit;

    /**
     * Constructor
     */
    constructor() {
        this._push = new Push();
        this._setupStarted = false;
        this._setupFinished = false;

        gameBus.on(GameEvents.CreateBattlefield, (fieldSize) => this.prepareField(fieldSize));
        gameBus.on(GameEvents.RequestSetupPermission, ({i, j}) => this.fillCell(i, j));
        gameBus.on(GameEvents.RequestFreePermission, ({i, j}) => this.freeCell(i, j));
    }

    /**
     * @return {*}
     */
    get battlefield() {
        if (this._shipsLimit) {
            throw new Error('Battlefield is not ready');
        }

        return this._battlefield;
    }

    /**
     *
     */
    private renderShipCount() {
        this._push.clearMessages();

        if (this._shipsLimit) {
            this.notifyShipsLimit();
        } else {
            this._setupFinished = true;

            this._push.addMessage('Корабли расставлены! Нажмите > , чтобы начать игру');
            this._push.render({level: PushLevels.Warning});

            gameBus.emit(GameEvents.DisableScene);
        }
    }

    /**
     * Prepare field by empty cells
     * @param {*} fieldSize
     */
    private prepareField(fieldSize) {
        if (this._setupStarted || this._setupFinished) {
            return;
        }

        this._shipsLimit = SetupValidator.computeShipsLimit(fieldSize);

        this._push.addMessage('Расставьте корабли на поле. ЛКМ - поставить, ПКМ - убрать.');
        this._push.render({level: PushLevels.Info});

        this.notifyShipsLimit();

        this._battlefield = Array.from(Array(fieldSize), () => (new Array(fieldSize)).fill(CellStatus.Empty));
    }

    /**
     * Try to fill cell or raise error
     * @param {int} i Row
     * @param {int} j Column
     */
    private fillCell(i, j) {
        if (this._setupFinished) return;

        this._setupStarted = true;

        switch (this._battlefield[i][j]) {
            case CellStatus.Empty:
                if (this._shipsLimit === 0) {
                    this._push.addMessage('Корабли закончились');
                    break;
                }
                this._battlefield[i][j] = CellStatus.Busy;
                this._shipsLimit--;
                gameBus.emit(GameEvents.Draw, {i, j, status: CellStatus.Busy});
                this.notifyShipsLimit()
                    .renderShipCount();
                return;
            case CellStatus.Busy:
                this._push.addMessage('Ячейка уже занята!');
                break;
            case CellStatus.Destroyed:
                this._push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
                break;
            default:
                break;
        }
        this._push.render({level: PushLevels.Error});
    }

    /**
     * Try to free cell or raise error
     * @param {int} i Row
     * @param {int} j Column
     */
    private freeCell(i, j) {
        if (this._setupFinished) return;

        this._setupStarted = true;

        switch (this._battlefield[i][j]) {
            case CellStatus.Empty:
                this._push.addMessage('Ячейка уже свободна!');
                break;
            case CellStatus.Busy:
                this._battlefield[i][j] = CellStatus.Empty;
                this._shipsLimit++;
                gameBus.emit(GameEvents.Draw, {i, j, status: CellStatus.Empty});
                this.notifyShipsLimit()
                    .renderShipCount();
                return;
            case CellStatus.Destroyed:
                this._push.addMessage('Ячейка уничтожена! (как ты вообще умудрился?)');
                break;
            default:
                break;
        }
        this._push.render({level: PushLevels.Error});
    }

    private notifyShipsLimit() {
        gameBus.emit(GameEvents.SetShipsToPlace, this._shipsLimit);
        return this;
    }
}
