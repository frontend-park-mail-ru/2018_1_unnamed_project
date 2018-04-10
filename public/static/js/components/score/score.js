'use strict';

define('Score', (require) => {
    const Component = require('Component');
    const GameEvents = require('game/core/events');

    const gameBus = require('game/core/bus');

    return class Score extends Component {
        /**
         * @param {*} element
         */
        constructor(element) {
            super({element, templateFunction: scoreTemplate});

            this._active = true;

            gameBus.on(GameEvents.SET_SCORE, (score) => {
                if (!this._active) return;

                this._value.innerText = `Очков ${score}`;
            });

            this.render({score: 'Очков 0'});
        }

        /**
         *
         */
        show() {
            this.element.removeAttribute('hidden');
        }

        /**
         *
         */
        hide() {
            this.element.setAttribute('hidden', 'hidden');
        }

        /**
         * @override
         * @param {Object} attrs
         */
        render(attrs) {
            super.render(attrs);

            this._value = this.element.querySelector('.score__text');
            this.show();

            return this;
        }
    };
});
