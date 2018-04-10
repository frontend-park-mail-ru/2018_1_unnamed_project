'use strict';

define('rand', () => {
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number}
     */
    return (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    };
});
