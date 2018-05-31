import {Loader} from "../../components/loader/loader";
import {PushLevels} from '../../components/message-container';
import {GameEvents} from "../../game/events";
import gameBus from "../../game/game-bus";
import {GameModes} from "../../game/game-modes";
import {WS} from "../../modules/ws";
import {GamePage} from "../game-page";
import {PageAccessTypes} from '../page';
import multiplayerPageTemplate from './multiplayer-page.pug';

export class MultiplayerPage extends GamePage {
    private _loader: Loader;
    private _ws: WS;

    /**
     *
     */
    constructor() {
        super({
            pageTemplate: multiplayerPageTemplate,
            canvasSelector: '#multiplayer-page__canvas',
            startButtonSelector: '.multiplayer-page__start-game-button',
            gameMode: GameModes.Online,
            onSelectedEvent: GameEvents.OnlineOpponentsCountSelected,
        });

        this._loader = new Loader();
        this._ws = new WS();
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {MultiplayerPage}
     */
    render(attrs) {
        super.render(attrs);
        this.push.renderShared({level: PushLevels.Success});
        this.profileBar.hide();
        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.LoggedInUser;
    }

    protected setGameStartedHandler() {
        this.startGameButton.addEventListener('click', (evt) => {
            evt.preventDefault();

            if (this.gameStarted) return;

            this._loader.show();
            this._ws.sendMessage(GameEvents.JoinGame, {
                count: this.playersCount,
                field: this.game.gameField.setupValidator.battlefield,
            });

            gameBus.on(GameEvents.GameStarted, () => {
                this.startGameButton.setAttribute('hidden', 'hidden');
                this.push.clear();
                this.score.show();
                this.score.setGameMode();

                gameBus.emit(GameEvents.SetScore, 0);

                this.gameStarted = true;
                this.game.startGame();
            });
        });

        return this;
    }
}
