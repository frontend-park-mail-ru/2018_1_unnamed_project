const fs = require('fs');
const recursive = require('recursive-readdir');

const excludeFiles = [
    'dist/index.html',
    'dist/manifest.json',
    'dist/sw.js',
];

recursive('dist')
    .then((files) => {
        files = files.filter((f) => !excludeFiles.includes(f)).map((f) => '/' + f);

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
const CACHE_NAME = 'ship-collision-cache-v2';
const cacheUrls = ${JSON.stringify([...routes, ...files], null, 4).replace(/"/g, '\'')};
this.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(cacheUrls)
            })
            .catch((err) => console.log('Cache error!!!', err))
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
                } 
                return fetch(evt.request);
            })
            .catch((err) => console.log('unable to fetch resource ', evt.request.url, err))
    );
});
`;
        fs.writeFile('dist/sw.js', swCode, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Service worker file created');
        });
    })
    .catch((err) => console.log('ERROR: ', err));
