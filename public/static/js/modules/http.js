(function () {

    const noop = () => null;


    class HttpModule {

        request({ HTTPmethod = 'GET', url = '/', data = {}} = {}) {
            const backendURL = 'http://localhost:8080';
            const options = {
                method: HTTPmethod,
                // HTTPmethod: HTTPmethod,
                headers: {
                    'Content-type': 'application/json',
                    'Access-Control-Request-Method': HTTPmethod,
                    'Cookie': this._cookie
                },
                mode: 'cors',
                credentials: 'include'
            };

            if (HTTPmethod === 'POST' && typeof data !== undefined)
                options.body = JSON.stringify(data);

            return fetch(backendURL + url, options)
                .then(response => {
                    return response.json();
                })
                .then(uresp => {
                    debugger;
                    if ((uresp.status >= 200 && uresp.status < 300) || !(uresp.status)) {
                        return uresp;
                    } else {
                        if (uresp.errors) {
                            throw uresp.errors.map(error => `${error.field}: ${error.defaultMessage}`)
                        } else {
                            throw [uresp.message];
                        }
                    }
                })
                .catch(error => {
                    throw error;
                });
        }
    }
    window.HttpModule = HttpModule;
})();