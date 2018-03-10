'use strict';

const application = new window.Application();
const router = window.Router;

router.addRoute(
	'menu',
	{re: '', handler: () => {router.openPage({page: Application.menuPage, hideBackRef: true})}}
).addRoute(
	'multiplayer',
	{re: '', handler: () => {router.openPage({page: Application.multiplayerPage})}}
).addRoute(
	'singleplayer',
	{re: '', handler: () => {router.openPage({page: Application.singleplayerPage})}}
).addRoute(
	'scoreboard',
	{re: '', handler: () => {router.openPage({page: Application.scoreboardPage})}}
).addRoute(
	'signin',
	{re: '', handler: () => {router.openPage({page: Application.signinPage})}}
).addRoute(
	'signup',
	{re: '', handler: () => {router.openPage({page: Application.signupPage})}}
).addRoute(
	'profile',
	{re: '', handler: () => {router.openPage({page: Application.profilePage})}}
).addRoute(
	'rules',
	{re: '', handler: () => {router.openPage({page: Application.rulesPage})}}
);

router.navigateTo('menu');
