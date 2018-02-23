const fs = require('fs');
const path = require('path');
const http = require('http');
const debug = require('debug');
const express = require('express');
const app = express();
const logger = debug('mylogger');
const public = __dirname + "/../public/";

app.use('/static', express.static(path.join(__dirname + '/public/static')));

app.get('/', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'template/index.html'));
});

app.listen(process.env.PORT || 3000);