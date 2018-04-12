/* eslint-disable */
const path = require('path');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const logger = debug('mylogger');

const public = __dirname + '/../public/';

app.use(body.json());
app.use(cookie());

app.use('/bundle.css', express.static(path.join(__dirname + '/../dist/bundle.css')));
app.use('/bundle.js', express.static(path.join(__dirname + '/../dist/bundle.js')));

app.get('/media/*', (req, res) => {
    logger(`STATIC FILE: ${req.url} ${req.method}`);
    res.sendFile(path.join(public, 'static', req.url));
});

app.get('/*', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'index.html'));
});

app.listen(process.env.PORT || 5000);
