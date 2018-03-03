'use strict';
const httpModule = new window.HttpModule();
const scoreboardBuilder = new window.ScoreboardBuilder('.js-scoreboard-table');
const push = new window.Push('.msg');
const api = new window.API();
const profileBuilder = new window.ProfileBuilder();
const back = document.getElementById('back');
const application = document.getElementById('application');
const menuSection = document.getElementById('menu');
const signinSection = document.getElementById('signin');
const signupSection = document.getElementById('signup');
const multiplayerSection = document.getElementById('multiplayer');
const singleplayerSection = document.getElementById('singleplayer');
const scoreboardSection = document.getElementById('scoreboard');
const rulesSection = document.getElementById('rules');
const profileSection = document.getElementById('profile');
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
    profile: profileSection,
    singleplayer: singleplayerSection,
    scoreboard: scoreboardSection,
    rules: rulesSection,
};

const sectionOpeners = {
    multiplayer: () => {
        api.loadMe((err, me) => {
            if (err) {
                openSection('signin');
            }
            resolve(response);
        })
    },
    scoreboard: openScoreboard,
    signup: openSignup,
    signin: openSignin
}

function hideAllExcept(section) {
    Object.entries(sections).forEach(
        ([key, value]) => value.hidden = (section !== key)
    );

    back.hidden = (section === 'menu');
}

function openSection(section) {
    let stopBuilding = false;
    if (typeof sectionOpeners[section] === 'function')
        stopBuilding = sectionOpeners[section]();

    if (!stopBuilding)
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
    api.loadMe((err, me) => {
        if (err) {
            openSection('signin')
        }
    })
    console.log('TODO game');
}

function openScoreboard() {
    api.loadScoreboard()
        .then(users => {
            scoreboardBuilder.data = users;
            scoreboardBuilder.render();
        }
    );
}

function openSignup() {
    signupBuilder.render();
    signupForm.addEventListener('submit', () => signupBuilder.onSubmitAuthForm(event, api.loadSignup));
}

function openSignin() {
    signinBuilder.render();
    signinForm.addEventListener('submit', () => signinBuilder.onSubmitAuthForm(event, api.loadSignin));
    const generatedSignUpHref = document.getElementsByClassName('signup')[0];
    generatedSignUpHref.addEventListener('click', click);
}

openSection('menu')
// signinBuilder.checkAuth();