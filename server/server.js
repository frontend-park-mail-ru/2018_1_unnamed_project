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

app.use('/static', express.static(path.join(__dirname + '/../public/static')));
app.use(body.json());
app.use(cookie());

app.get('/sw.js', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.header('Content-Type', 'application/javascript');
    res.sendFile(path.join(public + 'sw.js'));
});

app.get('/*', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'index.html'));
});

app.listen(process.env.PORT || 5000);
