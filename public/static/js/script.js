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

const signupForm = document.getElementsByClassName('js-signup-form')[0];
const signinForm = document.getElementsByClassName('js-signin-form')[0];


const sections = {
    menu: menuSection,
    signup: signupSection,
    signin: signinSection,
    multiplayer: multiplayer,
    singleplayer: singleplayerSection,
    scoreboard: scoreboardSection,
    rules: rulesSection,
};

const sectionOpeners = {
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

application.addEventListener('click', function (event) {
    const target = event.target;
    const sectionName = target.getAttribute('data-section');
    if (target.tagName.toLowerCase() === 'a') {
        openSection(sectionName);
    }
});

function openSection(section) {
    hideAllExcept(section);
    if (typeof sectionOpeners[section] === 'function'){
        sectionOpeners[section]();
    }
}

function openScoreboard(){

    loadScoreboard((err, users) => {
        if (err){
            console.error(err);
            return;
        }
        scoreboardBuilder.data = users;
        scoreboardBuilder.render();
    });
}

function loadScoreboard(callback){
    httpModule.request({
        method: 'GET',
        url: '/scoreboard',
        callback
    })
}

function openSignup(){
    const signupBuilder = new window.AuthFormsBuilder(signupForm);
    signupBuilder.render();
}

// function signupSubmit(){

// }

function signup(userData, callback){
    httpModule.request({
        method: 'POST',
        url: '/signup',
        data: userData,
        callback
    })
}


function openSignin(){
    const signinBuilder = new window.AuthFormsBuilder(signinForm);
    signinBuilder.render();
}

function loadMe(callback){
    httpModule.request({
        method: 'GET',
        url: '/me',
        callback
    })
}

function checkAuth(){
    loadMe((err, me) => {
        if (err){
            return;
        }

        console.log('LOGGED AS', me);
    });
}


openSection('menu');
