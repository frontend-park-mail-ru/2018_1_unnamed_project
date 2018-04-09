'use strict';

define('add-sw', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js', {scope: '/'})
            .then((registration) => console.log('SW REGISTERED'))
            .catch((err) => console.log(err));
    }
});
