'use strict';

define('game/Controllers', (require) => {
    const gameBus = require('game/core/bus');
    const gameEvents = require('game/core/events');

    return class Controllers {
        /**
         * @param {*} element
         */
        constructor(element) {
            this._element = element;

            this.setClickHandler();
        }

        /**
         * Устанавливает обработчик на клики.
         */
        setClickHandler() {
            this._element.onclick = (evt) => {
                evt.preventDefault();
                console.log(
                    'LCLICK',
                    {
                        x: evt.clientX - this._element.offsetLeft,
                        y: evt.clientY - this._element.offsetTop,
                    }
                );
                gameBus.emit(
                    gameEvents.LCLICK,
                    {
                        x: evt.clientX - this._element.offsetLeft,
                        y: evt.clientY - this._element.offsetTop,
                    }
                );
            };
            this._element.oncontextmenu = (evt) => {
                evt.preventDefault();
                console.log(
                    'RCLICK',
                    {
                        x: evt.clientX - this._element.offsetLeft,
                        y: evt.clientY - this._element.offsetTop,
                    }
                );
                gameBus.emit(
                    gameEvents.RCLICK,
                    {
                        x: evt.clientX - this._element.offsetLeft,
                        y: evt.clientY - this._element.offsetTop,
                    }
                );
            };
        }
    };
});
