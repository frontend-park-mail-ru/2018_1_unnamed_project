'use strict';

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const Router = require('Router');
        const MenuPage = require('MenuPage');
        const MultiplayerPage = require('MultiplayerPage');

        const root = document.getElementById('application');

        new Router(root)
            .addRoute('/', MenuPage)
            .addRoute('/multiplayer', MultiplayerPage)
            .start();
    });
})();
