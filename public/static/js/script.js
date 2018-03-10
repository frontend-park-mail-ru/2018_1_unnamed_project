'use strict';

const application = new window.Application();
const router = window.Router;

router.addRoute(
	'menu',
	{re: '', page: Application.menuPage, hideBackRef: true}
).addRoute(
	'multiplayer',
	{re: '', page: Application.multiplayerPage}
).addRoute(
	'singleplayer',
	{re: '', page: Application.singleplayerPage}
).addRoute(
	'scoreboard',
	{re: '', page: Application.scoreboardPage}
).addRoute(
	'signin',
	{re: '', page: Application.signinPage}
).addRoute(
	'signup',
	{re: '', page: Application.signupPage}
).addRoute(
	'profile',
	{re: '', page: Application.profilePage}
).addRoute(
	'rules',
	{re: '', page: Application.rulesPage}
);

router.navigateTo('menu');
