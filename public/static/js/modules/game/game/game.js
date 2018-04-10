'use strict';

define('Game', (require) => {
    const Controllers = require('game/Controllers');
    const GameEvents = require('game/core/events');
    const GameField = require('game/field/GameField');
    const GameModes = require('game/modes');
    const OfflineCore = require('game/core/OfflineCore');

    const gameBus = require('game/core/bus');

    return class Game {
        /**
         * @param {*} canvas
         * @param {Number} playersCount
         * @param {string} mode
         */
        constructor({canvas, playersCount, mode = GameModes.OFFLINE_MODE} = {}) {
            this.playersCount = playersCount;
            this.controllers = new Controllers(canvas);
            this.gameField = new GameField(canvas, playersCount);

            if (mode === GameModes.OFFLINE_MODE) {
                this._core = new OfflineCore();
            } else {
                throw new Error('Unsupported game mode');
            }
        }

        /**
         *
         */
        startGame() {
            gameBus.emit(GameEvents.ENABLE_SCENE);

            this.gameField.gameStarted = true;

            this._core.start();
        }
    };
});
