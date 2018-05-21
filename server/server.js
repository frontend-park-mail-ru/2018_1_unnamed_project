const path = require('path');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const logger = debug('mylogger');
const fs = require('fs');

const publicDir = `${__dirname}/../public/`;

const DIST_DIR = `${__dirname}/../dist/`;

app.use(body.json());
app.use(cookie());

app.use('/sw.js', express.static(path.join(DIST_DIR, 'sw.js')));

app.get('/media/*', (req, res) => {
    logger(`STATIC FILE: ${req.url} ${req.method} ${path.join(publicDir, 'static', req.url)}`);
    res.sendFile(path.join(publicDir, 'static', req.url));
});

app.get('/*', (req, res) => {
    logger(`${req.url} ${req.method}`);

    const fileName = (req.url === '/') ? 'index.html' : req.url;
    let filePath = path.join(DIST_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
    }

    res.sendFile(filePath);
});

// noinspection ES6ModulesDependencies
app.listen(process.env.PORT || 5000);
