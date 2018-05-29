const path = require('path');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const logger = debug('mylogger');
const fs = require('fs');
const uuid = require('uuid/v1');
const ws = require('express-ws');

const {MessageTypes} = require('./game-session.js');
const GameMechanics = require('./game-mechanics.js');

const publicDir = `${__dirname}/../public/`;

const DIST_DIR = `${__dirname}/../dist/`;

ws(app);

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

const users = new Map();
const gm = new GameMechanics();

setInterval(() => gm.gmStep(), 50);

app.ws('/game', (ws) => {
    const id = uuid();
    const playerInfo = {
        uuid: id,
        player: {},
        ws,
    };

    users.set(id, playerInfo);

    logger(`WS: новое соединение, id=${id}`);

    ws.on('close', () => {
        logger(`WS: соединение закрыто, id=${id}`);
        delete users.delete(id);
    });

    ws.on('message', (message) => {
        const {type, payload} = JSON.parse(message);
        logger(`WS: сообщение ${type}, ${payload}`);

        switch (type) {
        case MessageTypes.JOIN_GAME:
            const {count, field} = payload;
            playerInfo.player.field = field;
            gm.addWaiter(count, playerInfo);
            break;
        case MessageTypes.MAKE_MOVE:
            const {cell} = payload;
            gm.makeMove(playerInfo.player, cell);
            break;
        default:
            break;
        }
    });
});

// noinspection ES6ModulesDependencies
app.listen(process.env.PORT || 5000);
