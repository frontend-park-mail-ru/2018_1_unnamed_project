const fs = require('fs');
const path = require('path');
const http = require('http');
const debug = require('debug');
const express = require('express');
const app = express();
const logger = debug('mylogger');
const public = __dirname + "/../public/";



class User {

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.rate = Math.round(Math.random() * 100);
    }

    addToDate(value) {
        this.rate += value;
    }
}


const users = {
    'a_ikchurin': new User('tyoma11.95@mail.ru', 'a_ikchurin', 'pswd'),
    'cvkucherov': new User('cvkucherov@yandex.ru', 'cvkucherov', 'pswd'),
    'gabolaev': new User('gabolaev98@gmail.com', 'gabolaev', 'pswd'),
    'venger': new User('farir1408@gmail.com', 'venger', 'pswd')
};


app.use('/static', express.static(path.join(__dirname + '/../public/static')));

app.get('/', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'template/index.html'));
});

app.get('/scoreboard', (req, res) => {
    logger(`${req.url} ${req.method}`);
    const sorted = Object.values(users).sort((a, b) => {
        return a.rate < b.rate;
    })
    res.send(JSON.stringify(sorted));
});

app.listen(process.env.PORT || 3000);