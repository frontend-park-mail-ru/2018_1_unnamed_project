'use strict';

define('SingleplayerPage', (require) => {
    const AccessTypes = require('Page/access');
    const Controllers = require('game/Controllers');
    const GameField = require('game/field/GameField');
    const bus = require('bus');
    const gameBus = require('game/core/bus');
    const Page = require('Page');
    const gameModes = require('game/modes');
    const gameEvents = require('game/core/events');
    const OpponentsCountMenu = require('OpponentsCountMenu');

    /**
     * Страница одиночной игры.
     */
    return class SingleplayerPage extends Page {
        /**
         *
         */
        constructor() {
            super(singleplayerPageTemplate);
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
                this._gameField.init();
            });
            return this;
        }

        /**
         * @private
         * @return {SingleplayerPage}
         */
        setOpponentsCountSelectedHandler() {
            bus.on(gameEvents.OFFLINE_OPPONENTS_COUNT_SELECTED, ({opponentsCount}) => {
                this.renderBattleField(opponentsCount);
            });
            return this;
        }

        /**
         * ha-ha fuck you jslint
         * @param {*} playersCount
         */
        renderBattleField(playersCount) {
            this._canvas = document.querySelector('#singleplayer__canvas');
            [this._canvas.width, this._canvas.height] = SingleplayerPage.computeCanvasSize();
            gameBus.clear();
            this._gameField = new GameField(this._canvas, playersCount);
            this._controllers = new Controllers(this._canvas);
            this._canvas.hidden = false;
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
            opponentsCountMenu.render({gameMode: gameModes.OFFLINE_MODE});
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
