const fs = require('fs');
const recursive = require('recursive-readdir');


// Вторым аргументом передается имя директории, из которой будем кэшировать.
// См. package.json!
recursive('static')
    .then((files) => {
        const routes = [
            '/',
            '/multiplayer',
            '/profile',
            '/profile/settings',
            '/rules',
            '/scoreboard',
            '/signin',
            '/signup',
            '/singleplayer',
        ];
        const swCode = `'use strict';

const CACHE_NAME = 'ship-collision-cache-v1';

const cacheUrls = ${JSON.stringify([...routes, ...files], null, 4).replace(/"/g, '\'')};

this.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(cacheUrls))
            .catch((err) => console.log('Cache error!!!'))
    );
});

this.addEventListener('fetch', (evt) => {
    if (navigator.onLine) {
        return fetch(evt.request);
    }

    evt.respondWith(
        caches
            .match(evt.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return fetch(evt.request);
                }
            })
            .catch((err) => console.log('unable to fetch resource ', evt.request.url))
    );
});
`;
        fs.writeFile('sw.js', swCode, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Service worker file created');
        });
    })
    .catch((err) => console.log('ERROR: ', err));
