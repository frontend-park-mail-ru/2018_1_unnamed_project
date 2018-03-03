(function () {

    const noop = () => null;

    class HttpModule {
        request({ HTTPmethod = 'GET', url = '/', data = {} } = {}) {
            const options = {
                HTTPmethod: HTTPmethod,
                headers: {
                    'Content-type': 'application/json',
                    'Access-Control-Request-Method': HTTPmethod,
                    'Cookie': this._cookie
                },
            };

            if (HTTPmethod === 'POST' && typeof params !== undefined)
                options.body = JSON.stringify(params);

            return fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.alert(`RESPONSE PROBLEM: ${response}`);
                        return response;
                    }
                    throw new Error('RESPONSE PROBLEM');
                }).catch(error => {
                    console.log('FETCH PROBLEM: ' + error.message);
                    return error
                });
        }
    }

    window.HttpModule = HttpModule;
})();