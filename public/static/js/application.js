'use strict';

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const ProfileBar = require('ProfileBar');

        const Router = require('Router');
        const MenuPage = require('MenuPage');
        const MultiplayerPage = require('MultiplayerPage');
        const ProfilePage = require('ProfilePage');
        const SettingsPage = require('SettingsPage');
        const RulesPage = require('RulesPage');
        const ScoreboardPage = require('ScoreboardPage');
        const SigninPage = require('SigninPage');
        const SignupPage = require('SignupPage');
        const SingleplayerPage = require('SingleplayerPage');

        const User = require('User');

        const root = document.getElementById('application');

        root.insertAdjacentHTML('beforebegin', pushTemplate());
        root.insertAdjacentHTML('afterbegin', profileBarTemplate());

        new Router(root)
            .addRoute('/', MenuPage)
            .addRoute('/multiplayer', MultiplayerPage)
            .addRoute('/profile', ProfilePage)
            .addRoute('/profile/settings', SettingsPage)
            .addRoute('/rules', RulesPage)
            .addRoute('/scoreboard', ScoreboardPage)
            .addRoute('/signin', SigninPage)
            .addRoute('/signup', SignupPage)
            .addRoute('/singleplayer', SingleplayerPage)
            .start();

        const profileBar = new ProfileBar(); // eslint-disable-line no-unused-vars

        User.checkCurrentUser();
    });
})();
