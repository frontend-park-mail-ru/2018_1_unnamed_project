const fs = require('fs');
const path = require('path');
const http = require('http');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const uuid = require('uuid/v4');
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
app.use(body.json());
app.use(cookie());

app.get('/', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'template/index.html'));
});

function validate(body) {

    const regexes = {
        username: /^([a-zA-Z0-9]{7,})+$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        password_confirmation: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    };

    for (const key of Object.keys(regexes)) {
        if (!(key in body))
            return {
                status: 'ERROR',
                desc: `Not found ${key} argument`
            }
        if (!(body[key].match(regexes[key])))
            return{
                status: 'ERROR',
                desc: `${key} invalid format`
            }
    }
    
    if (body.password !== body.password_confirmation) {
        return {
            status: 'ERROR',
            desc: 'Passwords don\'t match'
        }
    }
    if (users[body.username])
        return {
            status: 'ERROR',
            desc: 'User already exists'
        };

    return {
        status: 'OK',
        desc: 'User created',
        id: Object.keys(users).length
    }
};

app.post('/signup', (req, res) => {

    data = req.body
    result = validate(data);
    if (result.status === 'OK') {
        users[data.username] = new User(data.email, data.username, data.password, data.password_confirmation);
        res.status(201).json(result);
    } else {
        res.status(401).json(result)
    }
});

app.get('/scoreboard', (req, res) => {
    logger(`${req.url} ${req.method}`);
    const sorted = Object.values(users).sort((a, b) => {
        return a.rate < b.rate;
    })
    res.send(JSON.stringify(sorted));
});

app.listen(process.env.PORT || 3000);