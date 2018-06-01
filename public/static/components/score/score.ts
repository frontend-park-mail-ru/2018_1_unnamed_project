import {Component} from '../component';
import scoreTemplate from './score.pug';

import './score.scss';

export class Score extends Component {
    private readonly _active: boolean;
    private _mainContainer;
    /**
     * Сколько кораблей осталось у игрока.
     */
    private _shipsLeft;
    /**
     * Сколько очков осталось у игрока.
     */
    private _score;
    /**
     * Сколько времени осталось на ход.
     */
    private _timeLeft;
    /**
     * Сколько кораблей осталось расставить.
     */
    private _shipsToPlace;

    /**
     * @param {*} element
     */
    constructor(element) {
        super({element, templateFunction: scoreTemplate});

        this._active = true;

        this.render({score: 'Очков 0'});
    }

    set score(score) {
        if (!this._active) return;
        this._score.innerText = `Очков ${score}`;
    }

    set shipsLeft(shipsAliveCount) {
        if (!this._active) return;
        this._shipsLeft.innerText = `Осталось кораблей ${shipsAliveCount}`;
    }

    set timeLeft(timeLeft) {
        if (!this._active) return;
        this._timeLeft.innerText = `Осталось ${timeLeft} секунд`;
    }

    set shipsToPlace(shipsLeft) {
        if (!this._active) return;
        this._shipsToPlace.innerText = `Доступно кораблей ${shipsLeft}`;
    }

    setDisposalMode() {
        if (!this._active) return;

        this._shipsLeft.setAttribute('hidden', 'hidden');
        this._timeLeft.setAttribute('hidden', 'hidden');
        this._score.setAttribute('hidden', 'hidden');
        this._shipsToPlace.removeAttribute('hidden');

        return this;
    }

    setGameMode() {
        if (!this._active) return;

        this._shipsToPlace.setAttribute('hidden', 'hidden');
        this._shipsLeft.removeAttribute('hidden');
        this._timeLeft.removeAttribute('hidden');
        this._score.removeAttribute('hidden');

        return this;
    }

    /**
     * @override
     * @param {Object} attrs
     */
    render(attrs) {
        super.render(attrs);

        this._mainContainer = this.element.querySelector('.score__main-container');
        this._score = this.element.querySelector('.score__score');
        this._shipsLeft = this.element.querySelector('.score__ships');
        this._timeLeft = this.element.querySelector('.score__time-left');
        this._shipsToPlace = this.element.querySelector('.score__ships-left');
        this.show();

        return this;
    }
}
