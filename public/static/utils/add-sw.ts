function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js', {scope: '/'})
            .then(() => console.log('SW REGISTERED'))
            .catch((err) => console.log(err));
    } else {
        console.log('UNABLE TO REGISTER SW');
    }

}

export default registerServiceWorker;
