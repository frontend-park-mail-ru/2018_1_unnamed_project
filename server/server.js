const path = require('path');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const logger = debug('mylogger');

const publicDir =  `${__dirname}/../public/`;

app.use(body.json());
app.use(cookie());

app.use('/sw.js', express.static(path.join(__dirname, '/../dist/sw.js')));

app.get('/dist/*', (req, res) => {
    logger(`BUNDLE: ${req.url} ${req.method}`);
    res.sendFile(path.join(__dirname, '/../', req.url));
});

app.get('/media/*', (req, res) => {
    logger(`STATIC FILE: ${req.url} ${req.method} ${path.join(publicDir, 'static', req.url)}`);
    res.sendFile(path.join(publicDir, 'static', req.url));
});

app.get('/*', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(publicDir, 'index.html'));
});

// noinspection ES6ModulesDependencies
app.listen(process.env.PORT || 5000);
