'use strict';

define('game/core/Core', () => {
    return class Core {
        /**
         * @abstract
         */
        start() {
            throw new Error('This method must be overridden');
        }
    };
});
