'use strict';

(function() {
    /**
     * Компонент для отрисовки формы мультплеера.
     */
    class Multiplayer extends window.AbstractBuilder {
        /**
         * @param {string} selector
         */
        constructor(selector) {
            super(selector);
        }

        /**
         *
         */
        render() {
            if (!this.node) return;
            this.node.insertAdjacentHTML('afterbegin', multiplayerTemplate());
        }
    }

    window.Multiplayer = Multiplayer;
})();
