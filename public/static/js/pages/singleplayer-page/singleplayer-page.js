'use strict';

define('SingleplayerPage', (require) => {
    const AccessTypes = require('Page/access');
    const Controllers = require('game/Controllers');
    const GameField = require('game/field/GameField');
    const Page = require('Page');

    /**
     * Страница одиночной игры.
     */
    return class SingleplayerPage extends Page {
        /**
         *
         */
        constructor() {
            super(singleplayerPageTemplate);
            this.setWindowResizeHandler();
        }

        /**
         * @private
         * @return {*[]}
         */
        static computeCanvasSize() {
            return [window.innerWidth * 0.75, window.innerHeight * 0.75];
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
         * @override
         * @param {Object} attrs
         * @return {SingleplayerPage}
         */
        render(attrs) {
            super.render(attrs);

            this._canvas = this.element.querySelector('#singleplayer__canvas');
            [this._canvas.width, this._canvas.height] = SingleplayerPage.computeCanvasSize();

            this._gameField = new GameField(this._canvas);
            this._gameField.init();

            // noinspection JSUnusedGlobalSymbols
            this._controllers = new Controllers(this._canvas);

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
