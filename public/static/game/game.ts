import {User} from '../models/user';
import {Controllers} from './controllers';
import {Core} from './core';
import {GameField} from './field/field';
import {GameModes} from './game-modes';
import {OfflineCore} from './offline-core';
import {OnlineCore} from './online-core';

export class Game {
    public gameField;
    protected playersCount;
    protected controllers;
    private _core: Core;

    constructor(canvas, playersCount: number, mode = GameModes.Offline) {
        this.playersCount = playersCount;
        this.controllers = new Controllers(canvas);
        this.gameField = new GameField(canvas, playersCount);

        switch (mode) {
            case GameModes.Offline:
                this._core = new OfflineCore();
                break;
            case GameModes.Online:
                this._core = new OnlineCore();
                break;
            default:
                throw new Error('Unsupported game mode');
        }
    }

    startGame() {
        this.gameField.gameStarted = true;
        const username = (User.currentUser) ? User.currentUser.username : 'Игрок';
        const battlefield = this.gameField.setupValidator.battlefield;
        this._core.start(username, battlefield, this.playersCount);
    }
}
