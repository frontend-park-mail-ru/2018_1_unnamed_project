'use strict';

define('SingleplayerPage', (require) => {
    const AccessTypes = require('Page/access');
    const GameEvents = require('game/core/events');
    const GameModes = require('game/modes');
    const OpponentsCountMenu = require('OpponentsCountMenu');
    const Page = require('Page');

    const Game = require('Game');

    const bus = require('bus');
    const gameBus = require('game/core/bus');

    /**
     * Страница одиночной игры.
     */
    return class SingleplayerPage extends Page {
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
         * @return {*[]}
         */
        static computeCanvasSize() {
            const size = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
            return [size * 0.75, size * 0.75];
        }

        /**
         * @private
         * @return {SingleplayerPage}
         */
        setWindowResizeHandler() {
            window.addEventListener('resize', () => {
                if (!this._canvas) return;
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
            bus.on(GameEvents.OFFLINE_OPPONENTS_COUNT_SELECTED, ({opponentsCount}) => {
                this.renderBattleField(opponentsCount);
            });
            return this;
        }

        /**
         * @return {SingleplayerPage}
         */
        setDisableSceneHandler() {
            gameBus.on(GameEvents.DISABLE_SCENE, () => {
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

            this._game = new Game({
                canvas: this._canvas,
                playersCount,
            });

            this._canvas.hidden = false;
            this.setDisableSceneHandler()
                .setStartGameHandler();

            // this._gameField = new GameField(this._canvas, playersCount);
            // this._controllers = new Controllers(this._canvas);
        }

        /**
         * @override
         * @param {Object} attrs
         * @return {SingleplayerPage}
         */
        render(attrs) {
            super.render(attrs);
            const pcm = document.createElement('div');
            pcm.className = 'ocm';
            this.element.appendChild(pcm);
            const opponentsCountMenu = new OpponentsCountMenu({
                element: pcm, attrs: {maxOpponentsCount: 4}});
            opponentsCountMenu.render({gameMode: GameModes.OFFLINE_MODE});
            return this;
        }

        /**
         * @override
         * @return {string}
         */
        accessType() {
            return AccessTypes.ANY_USER;
        }
    };
});
