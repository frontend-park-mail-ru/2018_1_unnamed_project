function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js', {scope: '/'}).then(() => null);
    }
}

export default registerServiceWorker;
