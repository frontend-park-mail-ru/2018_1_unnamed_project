'use strict';
const scoreboardBuilder = new window.ScoreboardBuilder('.js-scoreboard-table');
const multiplayerBuilder = new window.Multiplayer('.multiplayer');
const profileBuilder = new window.ProfileBuilder('.profile');
const profileSection = document.getElementById('profile');
const push = new window.Push('.msg');
const api = new window.API();
const back = document.getElementById('back');
const menuSection = document.getElementById('menu');
const signinSection = document.getElementById('signin');
const signupSection = document.getElementById('signup');
const multiplayerSection = document.getElementById('multiplayer');
const singleplayerSection = document.getElementById('singleplayer');
const scoreboardSection = document.getElementById('scoreboard');
const rulesSection = document.getElementById('rules');
const hrefs = document.querySelectorAll('[data-section]');

const signupForm = document.getElementsByClassName('js-signup-form')[0];
const signupBuilder = new window.AuthFormsBuilder(signupForm);
const signinForm = document.getElementsByClassName('js-signin-form')[0];
const signinBuilder = new window.AuthFormsBuilder(signinForm);

const sections = {
    menu: menuSection,
    signup: signupSection,
    signin: signinSection,
    multiplayer: multiplayerSection,
    singleplayer: singleplayerSection,
    scoreboard: scoreboardSection,
    rules: rulesSection,
    profile: profileSection,
};

const sectionOpeners = {
    multiplayer: openMultiplayer,
    scoreboard: openScoreboard,
    signup: openSignup,
    signin: openSignin,
    profile: openProfile,
};

function hideAllExcept(section) {
    Object.entries(sections).forEach(
        ([key, value]) => value.hidden = (section !== key)
    );

    back.hidden = (section === 'menu');
}

function openSection(section) {
    let stopBuilding = false;
    if (typeof sectionOpeners[section] === 'function') {
        stopBuilding = sectionOpeners[section]();
    }

    if (!stopBuilding) {
        hideAllExcept(section);
    }
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

function openScoreboard() {
    api.scoreboard()
        .then((users) => {
            scoreboardBuilder.data = users;
            scoreboardBuilder.render();
        }
        );
}

function openSignup() {
    signupBuilder.render();
    signupForm.addEventListener('submit', () => signupBuilder.onSubmitAuthForm(event, api.signup));
}

function openMultiplayer() {
    api.me()
        .then((response) => multiplayerBuilder.render())
        .catch((error) => openSection('signin'));
}

function openSignin() {
    signinBuilder.render();
    signinForm.addEventListener('submit', () => signinBuilder.onSubmitAuthForm(event, api.signin));
    const generatedSignUpHref = document.getElementsByClassName('signup')[0];
    generatedSignUpHref.addEventListener('click', click);
}

function openProfile() {
    api.me()
        .then((response) => {
            profileBuilder.data = response;
            profileBuilder.render();
        })
        .catch((error) => openSection('signin'));
}

openSection('menu');
profileBuilder.updateBar();
