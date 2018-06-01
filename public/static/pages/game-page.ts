import {GameOver} from "../components/game-over/game-over";
import {OpponentsCountMenu} from "../components/opponents-count-menu/opponents-count-menu";
import {Score} from "../components/score/score";
import {GameEvents} from "../game/events";
import {Game} from "../game/game";
import gameBus from "../game/game-bus";
import {deviceHeight, deviceWidth} from "../utils/screen-params";
import {Page} from "./page";

export abstract class GamePage extends Page {
    public static readonly MAX_OPPONENTS_COUNTS = 4;

    protected static computeCanvasSize() {
        const currentWidth = deviceWidth();
        const currentHeight = deviceHeight();

        const size = (currentWidth > currentHeight) ? currentHeight : currentWidth;

        switch (true) {
            case size > 750:
                return [size * 0.65, size * 0.65];
            default:
                return [size * 0.85, size * 0.85];
        }
    }

    protected gameStarted: boolean;
    protected game: Game;
    protected canvasSelector: string;
    protected startButtonSelector: string;
    protected canvas;
    protected scoreRoot;
    protected score: Score;
    protected opponentsCountMenuRoot;
    protected opponentsCountMenu: OpponentsCountMenu;
    protected startGameButton;
    protected gameOver: GameOver;
    protected playersCount;

    private readonly _onSelectedEvent: string;

    protected constructor({pageTemplate, canvasSelector, startButtonSelector, gameMode, onSelectedEvent}) {
        super(pageTemplate);

        this.attrs = {gameMode};
        this.canvasSelector = canvasSelector;
        this.startButtonSelector = startButtonSelector;
        this.gameStarted = false;
        this._onSelectedEvent = onSelectedEvent;

        window.addEventListener('resize', () => {
            if (!this.canvas || this.gameStarted || !this.game) return;
            [this.canvas.width, this.canvas.height] = GamePage.computeCanvasSize();
            this.game.gameField.init(null, true);
        });
    }

    render(attrs: object): GamePage {
        super.render(attrs);

        this.canvas = this.element.querySelector(this.canvasSelector);
        [this.canvas.width, this.canvas.height] = GamePage.computeCanvasSize();
        this.canvas.hidden = true;

        this.startGameButton = this.element.querySelector(this.startButtonSelector);

        this.scoreRoot = this.element.querySelector('.score__root');
        this.score = new Score(this.scoreRoot);
        this.score.hide();

        this.opponentsCountMenuRoot = this.element.querySelector('.ocm');
        this.opponentsCountMenu = new OpponentsCountMenu({
            element: this.opponentsCountMenuRoot,
            attrs: {
                maxOpponentsCount: GamePage.MAX_OPPONENTS_COUNTS,
                onSelectedEvent: this._onSelectedEvent,
            } as any,
        });
        this.opponentsCountMenu.render(attrs);

        this.setOpponentsCountSelectedHandler();

        this.profileBar.hide();

        return this;
    }

    protected setOpponentsCountSelectedHandler() {
        gameBus.on(this._onSelectedEvent, ({opponentsCount}) => {
            this.score.hide();
            this.renderBattleField(opponentsCount);
        });
        return this;
    }

    protected setGameStartedHandler() {
        this.startGameButton.addEventListener('click', (evt) => {
            evt.preventDefault();

            if (this.gameStarted) return;

            this.startGameButton.setAttribute('hidden', 'hidden');
            this.push.clear();
            this.score.show();
            this.score.setGameMode();

            gameBus.emit(GameEvents.SetScore, 0);

            this.gameStarted = true;
            this.game.startGame();
        });
        return this;
    }

    protected setSetScoreHandler() {
        gameBus.on(GameEvents.SetScore, (playerScore) => {
            this.score.score = playerScore;
        });
        return this;
    }

    protected setSetTimeLeftHandler() {
        gameBus.on(GameEvents.SetTimeLeft, (timeLeft) => {
            this.score.timeLeft = timeLeft;
        });
        return this;
    }

    protected setSetShipsHandler() {
        gameBus.on(GameEvents.SetShipsLeft, (shipsLeft) => {
            this.score.shipsLeft = shipsLeft;
        });
        return this;
    }

    protected setSetShipsLeftHandler() {
        gameBus.on(GameEvents.SetShipsToPlace, (shipsToPlace) => {
            this.score.shipsToPlace = shipsToPlace;
        });
        return this;
    }

    protected setDisableSceneHandler() {
        gameBus.on(GameEvents.DisableScene, () => {
            if (this.gameStarted || !this.startGameButton) {
                return;
            }
            this.startGameButton.removeAttribute('hidden');
        });
        return this;
    }

    protected setGameOverHandler() {
        gameBus.on(GameEvents.GameOver, ({scoreboard, isWinner}) => {
            this.gameStarted = false;
            this.canvas.hidden = true;
            this.score.hide();

            const gameOverElement = document.createElement('div');
            gameOverElement.className = 'game__gameover';
            this.element.insertAdjacentElement('beforeend', gameOverElement);
            this.gameOver = new GameOver({element: gameOverElement});
            this.gameOver.render({win: isWinner});
        });
        return this;
    }

    protected renderBattleField(playersCount) {
        gameBus.clear();

        this.playersCount = playersCount;

        this.canvas.removeAttribute('hidden');
        this.opponentsCountMenu.hide();
        this.score
            .setDisposalMode()
            .show();
        this.setOpponentsCountSelectedHandler()
            .setDisableSceneHandler()
            .setGameStartedHandler()
            .setSetScoreHandler()
            .setSetShipsHandler()
            .setSetShipsLeftHandler()
            .setSetTimeLeftHandler()
            .setGameOverHandler();

        this.game = new Game(this.canvas, playersCount);
    }
}
