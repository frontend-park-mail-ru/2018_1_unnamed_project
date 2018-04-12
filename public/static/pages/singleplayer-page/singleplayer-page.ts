import {OpponentsCountMenu} from "../../components/opponents-count-menu/opponents-count-menu";
import {Score} from "../../components/score/score";
import {GameEvents} from "../../game/events";
import {Game} from "../../game/game";
import gameBus from "../../game/game-bus";
import {GameModes} from "../../game/game-modes";
import bus from "../../modules/bus";
import {Page, PageAccessTypes} from "../page";
import singleplayerPageTemplate from "./singleplayer-page.pug";
import {GameOver} from "./../../components/game-over/game-over"

import "./singleplayer-page.css";

export class SingleplayerPage extends Page {
    /**
     * @private
     * @return {*[]}
     */
    private static computeCanvasSize() {
        const size = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
        return [size * 0.75, size * 0.75];
    }
    
    private _gameStarted;
    private _game: Game;

    private _canvas;
    private _startGameButton;
    private _scoreRoot;
    private _score: Score;
    private _gameOver: GameOver

    /**
     *
     */
    constructor() {
        super(singleplayerPageTemplate);

        this._gameStarted = false;
        this.setWindowResizeHandler()
            .setOpponentsCountSelectedHandler();
    }

    /**
     * @private
     * @return {SingleplayerPage}
     */
    setWindowResizeHandler() {
        window.addEventListener('resize', () => {
            if (!(this._canvas && this._gameStarted)) return;
            [this._canvas.width, this._canvas.height] = SingleplayerPage.computeCanvasSize();
            this._game.gameField.init();
        });
        return this;
    }

    /**
     * @private
     * @return {SingleplayerPage}
     */
    setOpponentsCountSelectedHandler() {
        bus.on(GameEvents.OfflineComponentsCountSelected, ({opponentsCount}) => {
            this.renderBattleField(opponentsCount);
        });
        return this;
    }

    /**
     * @private
     * @return {SingleplayerPage}
     */
    setGameOverHandler() {       
        const gameOverElement = document.createElement('div');
        gameOverElement.className = 'game__gameover';
        this.element.appendChild(gameOverElement)
        this._gameOver = new GameOver({element:gameOverElement})        
        gameBus.on(GameEvents.GameOver, 
            ({scoreboard, isWinner}) => {
                this._gameStarted = false;
                this._canvas.hidden = true;
                this._gameOver.render({win: isWinner});
            });
        return this;
    }

    /**
     * @return {SingleplayerPage}
     */
    setDisableSceneHandler() {
        gameBus.on(GameEvents.DisableScene, () => {
            if (this._gameStarted || !this._startGameButton) return;

            this._startGameButton.removeAttribute('hidden');
        });
        return this;
    }

    /**
     * @return {SingleplayerPage}
     */
    setStartGameHandler() {
        this._startGameButton.addEventListener('click', (evt) => {
            evt.preventDefault();
            this._startGameButton.setAttribute('hidden', 'hidden');
            this._score.show();

            this._gameStarted = true;
            this._game.startGame();
        });
        return this;
    }

    /**
     * ha-ha fuck you jslint
     * @param {*} playersCount
     */
    renderBattleField(playersCount) {
        this._canvas = this.element.querySelector('#singleplayer-page__canvas');
        [this._canvas.width, this._canvas.height] = SingleplayerPage.computeCanvasSize();

        this._startGameButton = this.element.querySelector('.singleplayer-page__start-game-button');

        gameBus.clear();

        gameBus.on(GameEvents.SetScore, (score) => this._score.score = score);

        this._game = new Game(this._canvas, playersCount);

        this._canvas.hidden = false;
        this.setDisableSceneHandler()
            .setStartGameHandler()
            .setGameOverHandler();
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {SingleplayerPage}
     */
    render(attrs) {
        super.render(attrs);

        this._scoreRoot = this.element.querySelector('.score__root');
        this._score = new Score(this._scoreRoot);
        this._score.hide();

        const pcm = document.createElement('div');
        pcm.className = 'ocm';
        this.element.appendChild(pcm);

        const opponentsCountMenu = new OpponentsCountMenu({element: pcm, attrs: {maxOpponentsCount: 4}} as any);
        opponentsCountMenu.render({gameMode: GameModes.Offline});
        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }
}
