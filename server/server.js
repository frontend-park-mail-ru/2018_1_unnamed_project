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

app.use('/sw.js', express.static(path.join(__dirname + '/../dist/sw.js')));

app.get('/dist/*', (req, res) => {
    logger(`BUNDLE: ${req.url} ${req.method}`);
    res.sendFile(path.join(__dirname, '/../', req.url));
});

app.get('/media/*', (req, res) => {
    logger(`STATIC FILE: ${req.url} ${req.method} ${path.join(public, 'static', req.url)}`);
    res.sendFile(path.join(public, 'static', req.url));
});

app.get('/*', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public, 'index.html'));
});

app.listen(process.env.PORT || 5000);
