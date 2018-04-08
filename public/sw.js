'use strict';

const CACHE_NAME = 'ship-collision-v1';

const cacheUrls = [
    '/',
    'static/js/models/user/user.js',
];

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
            .catch((err) => console.log(`unable to fetch resource ${evt.request.url}`))
    );
});
