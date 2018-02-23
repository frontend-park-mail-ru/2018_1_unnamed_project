'use strict';
const httpModule = new window.HttpModule();
const scoreboardBuilder = new window.ScoreboardBuilder('.js-scoreboard-table');

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

const signupForm = document.getElementsByClassName('js-signup-form')[0];
const signinForm = document.getElementsByClassName('js-signin-form')[0];

const header = document.getElementById('auth-info');

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
    loadMe((err, me) => {
        if (err) openSection('signni');
    })
    console.log('TODO game');
}

function openScoreboard() {
    loadScoreboard((err, users) => {
        if (err) return;

        scoreboardBuilder.data = users;
        scoreboardBuilder.render();
    });
}

function loadScoreboard(callback) {
    httpModule.request({
        method: 'GET',
        url: '/scoreboard',
        callback
    })
}

function onSubmitAuthForm(event, func) {
    event.preventDefault();

    const form = event.currentTarget;
    const formElements = form.elements;

    const formdata = {};

    Object.values(form.elements).forEach((field) => {
        if (field.type !== 'submit') {
            formdata[field.name] = field.value;
        }
    });

    func(formdata, function (err, response) {
        if (err) {
            signupForm.reset();
            alert('Access denied!');
            return;
        }

        loadMe((err, me) => {
            if (err) return;
            header.innerText = me.username;
            openSection('realMultiplayer');
        })
    });
}

// === SIGNUP ===
function openSignup() {
    const signupBuilder = new window.AuthFormsBuilder(signupForm);
    signupBuilder.render();

    signupForm.addEventListener('submit', () => onSubmitAuthForm(event, loadSignup));
}


function loadSignup(userData, callback) {
    httpModule.request({
        method: 'POST',
        url: '/signup',
        data: userData,
        callback
    })
}


// === SIGNIN === 
function openSignin() {
    loadMe((err, me) => {
        if (!err) openSection('realMultiplayer');
    });
    const signinBuilder = new window.AuthFormsBuilder(signinForm);
    signinBuilder.render();
    signinForm.addEventListener('submit', () => onSubmitAuthForm(event, loadSignin));
}

function loadSignin(userData, callback) {
    httpModule.request({
        method: 'POST',
        url: '/signin',
        data: userData,
        callback
    })
}

function loadMe(callback) {
    httpModule.request({
        method: 'GET',
        url: '/me',
        callback
    })
}

openSection('menu');
loadMe((err, me) => {
    header.innerHTML = err ? 'Unauthorized' : me.username;
});