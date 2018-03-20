'use strict';

const application = window.application;
const router = window.router;

router.addRoute(
    'menu',
    {page: application.menuPage, hideBackRef: true}
).addRoute(
    'multiplayer',
    {page: application.multiplayerPage}
).addRoute(
    'singleplayer',
    {page: application.singleplayerPage}
).addRoute(
    'scoreboard',
    {page: application.scoreboardPage}
).addRoute(
    'signin',
    {page: application.signinPage}
).addRoute(
    'signup',
    {page: application.signupPage}
).addRoute(
    'profile',
    {page: application.profilePage}
).addRoute(
    'settings',
    {page: application.settingsPage}
).addRoute(
    'rules',
    {page: application.rulesPage}
).addRoute(
    'uxui',
    {page: application.uxuiPage}
);


router.navigateTo('menu');
