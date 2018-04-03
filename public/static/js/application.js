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
        const UserEvents = require('User/events');

        const bus = require('bus');

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

        const profileBar = new ProfileBar();
        bus.on(UserEvents.CURRENT_USER_CHANGED, (newUser) => {
            if (newUser) {
                profileBar.username = newUser.username;
                profileBar.logoutAvailable = true;
            } else {
                profileBar.username = 'вы не авторизованы';
                profileBar.logoutAvailable = false;
            }
        });

        User.checkCurrentUser();
    });
})();
