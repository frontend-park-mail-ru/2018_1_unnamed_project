'use strict';

define('game/field/cell/Cell', (require) => {
    const Rectangle = require('graphics/Rectangle');
    const GameBus = require('game/core/bus');
    const GameEvents = require('game/core/bus');
    const status = require('game/cell/status');

    return class Cell extends Rectangle {
        /**
         * @param {Object} ctx
         * @param {Number} width
         * @param {Number} height
         */
        constructor(ctx, {width = 0, height = 0} = {}) {
            super(ctx, {width, height});

            this._enabled = true;
            this.changeStatus(status.EMPTY);
        }

        /**
         * Состояние для демонстрации пользователю (можно или нельзя взаимодействовать с объектом).
         * @param {boolean} isEnabled
         */
        set enabled(isEnabled) {
            this._enabled = isEnabled;
            this.changeStatus();
        }

        /**
         * @private
         * @param {Object} status
         * @return {Cell}
         */
        changeStatus(status = null) {
            if (status !== null) {
                this.status = status;
            }

            const colors = (this._enabled) ? this.status.enabled : this.status.disabled;
            this.borderColor = colors.borderColor;
            this.fillColor = colors.fillColor;

            return this;
        }

        /**
         * Устанавливает статус клетки и при необходимости доступность для взаимодействия.
         * @param {string} status
         * @param {boolean|null} enabled
         * @return {Cell}
         */
        setStatus(status, enabled = null) {
            if (enabled !== null) {
                this._enabled = enabled;
            }
            return this.changeStatus(status);
        }
    };
});
