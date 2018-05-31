import {GameEvents} from '../../game/events';
import gameBus from '../../game/game-bus';
import {GameModes} from '../../game/game-modes';
import {GamePage} from "../game-page";
import {PageAccessTypes} from "../page";
import singleplayerPageTemplate from './singleplayer-page.pug';

import './singleplayer-page.scss';

export class SingleplayerPage extends GamePage {
    /**
     *
     */
    constructor() {
        super({
            pageTemplate: singleplayerPageTemplate,
            canvasSelector: '#singleplayer-page__canvas',
            startButtonSelector: '.singleplayer-page__start-game-button',
            gameMode: GameModes.Offline,
            onSelectedEvent: GameEvents.OfflineOpponentsCountSelected,
        });
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }

    /**
     * @param {*} playersCount
     */
    protected renderBattleField(playersCount) {
        super.renderBattleField(playersCount);
        gameBus.on(GameEvents.SetScore, (score) => this.score.score = score);
    }
}
