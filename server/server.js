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

const players = new Map();

const games = new Map();
games.set(2, []);
games.set(3, []);
games.set(4, []);

app.ws('/game', (ws, req) => {
    const id = Math.round(Math.random() * 100);
    players[id] = ws;

    logger(`WS: новое соединение, id=${id}`);

    ws.on('close', () => {
        logger(`WS: соединение закрыто, id=${id}`);
        delete players[id];
    });

    ws.on('message', (message) => {
        const {type, payload} = JSON.parse(message);
        logger(`WS: сообщение ${type}, ${payload}`);

        switch (type) {
        case 'JOIN_GAME':
            const {count, field} = payload;

            if (! 1 <= count <= 3) {
                return;
            }

            games.set(count, {
                field,
                id,
            });
        case 'MAKE_MOVE':
            break;
        default:
            break;
        }
    });
});

// noinspection ES6ModulesDependencies
app.listen(process.env.PORT || 5000);
