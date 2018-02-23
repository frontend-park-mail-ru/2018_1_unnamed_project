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


const sections = {
    menu: menuSection,
    signin: signinSection,
    signup: signupSection,
    multiplayer: multiplayerSection,
    singleplayer: singleplayerSection,
    scoreboard: scoreboardSection,
    rules: rulesSection,
};

const sectionOpeners = {
    scoreboard: openScoreboard
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

openSection('menu');
