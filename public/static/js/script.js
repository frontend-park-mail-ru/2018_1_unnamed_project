'use strict';
const httpModule = new window.HttpModule();
const scoreboardBuilder = new window.ScoreboardBuilder('.js-scoreboard-table');
const push = new window.Push('.msg');
const api = new window.API();
const profile = new window.Profile();
const back = document.getElementById('back');
const application = document.getElementById('application');
const menuSection = document.getElementById('menu');
const signinSection = document.getElementById('signin');
const signupSection = document.getElementById('signup');
const multiplayerSection = document.getElementById('multiplayer');
const singleplayerSection = document.getElementById('singleplayer');
const scoreboardSection = document.getElementById('scoreboard');
const rulesSection = document.getElementById('rules');
const hrefs = document.querySelectorAll('[data-section]');
const header = document.getElementById('auth-info');

const signupForm = document.getElementsByClassName('js-signup-form')[0];
const signupBuilder = new window.AuthFormsBuilder(signupForm);
const signinForm = document.getElementsByClassName('js-signin-form')[0];
const signinBuilder = new window.AuthFormsBuilder(signinForm);

const sections = {
    menu: menuSection,
    signup: signupSection,
    realMultiplayer: multiplayerSection,
    multiplayer: signinSection,
    singleplayer: singleplayerSection,
    scoreboard: scoreboardSection,
    rules: rulesSection,
};

const sectionOpeners = {
    multiplayer: openSignin,
    scoreboard: openScoreboard,
    signup: openSignup,
    realMultiplayer: openMultiplayer
}

function hideAllExcept(section) {
    Object.entries(sections).forEach(
        ([key, value]) => value.hidden = (section !== key)
    );

    back.hidden = (section === 'menu');
}

function openSection(section) {
    if (typeof sectionOpeners[section] === 'function') {
        sectionOpeners[section]();
    }
    hideAllExcept(section);
    push.clear();
}

function click(event) {
    const target = event.target;
    const sectionName = target.getAttribute('data-section');
    event.preventDefault();
    if (target.tagName.toLowerCase() === 'a') {
        openSection(sectionName);
    }
}

Object.entries(hrefs).forEach(([key, value]) => {
    value.addEventListener('click', click);
});

function openMultiplayer() {
    api.loadMe((err, me) => { if (err) openSection('signin') })
    console.log('TODO game');
}

function openScoreboard() {
    api.loadScoreboard((err, users) => {
        if (err) return;
        scoreboardBuilder.data = users;
        scoreboardBuilder.render();
    });
}

function openSignup() {
    signupBuilder.render();
    signupForm.addEventListener('submit', () => signupBuilder.onSubmitAuthForm(event, api.loadSignup));
}

function openSignin() {
    api.loadMe((err, me) => {
        if (!err) openSection('realMultiplayer');
    });
    signinBuilder.render();
    signinForm.addEventListener('submit', () => signinBuilder.onSubmitAuthForm(event, api.loadSignin));
    const generatedSignUpHref = document.getElementsByClassName('signup')[0];
    generatedSignUpHref.addEventListener('click', click);
}

openSection('menu')
profile.setProfileBar();