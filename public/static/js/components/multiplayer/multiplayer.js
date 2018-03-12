'use strict';

(function() {
    const AbstractBuilder = window.AbstractBuilder;
    /**
     * Компонент для отрисовки формы мультплеера.
     */
    class Multiplayer extends AbstractBuilder {
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
            super.render();
            // noinspection JSUnresolvedFunction
            this.node.insertAdjacentHTML('afterbegin', multiplayerTemplate());
        }
    }

    window.Multiplayer = Multiplayer;
})();
