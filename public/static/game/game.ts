import {User} from "../models/user";
import {Controllers} from "./controllers";
import {Core} from "./core";
import {GameEvents} from "./events";
import {GameField} from "./field/field";
import gameBus from "./game-bus";
import {GameModes} from "./game-modes";
import {OfflineCore} from "./offline-core";

export class Game {
    public gameField;
    protected playersCount;
    protected controllers;
    private _core: Core;

    constructor(canvas, playersCount: number, mode = GameModes.Offline) {
        this.playersCount = playersCount;
        this.controllers = new Controllers(canvas);
        this.gameField = new GameField(canvas, playersCount);

        if (mode === GameModes.Offline) {
            this._core = new OfflineCore();
        } else {
            throw new Error('Unsupported game mode');
        }
    }

    /**
     *
     */
    startGame() {
        gameBus.emit(GameEvents.EnableScene);

        this.gameField.gameStarted = true;

        const username = User.currentUser.username;
        const battlefield = this.gameField.setupValidator.battlefield;
        this._core.start(username, battlefield, this.playersCount);
    }
}
