(function() {
    // const backendURL = 'http://localhost:8080'; // debug
    const backendURL = 'https://dev-api-shipcollision.herokuapp.com'; // production

    class HttpModule {
        request({HTTPmethod = 'GET', url = '/', contentType, data = {}} = {}) {
            const options = {
                method: HTTPmethod,
                headers: {
                    'Access-Control-Request-Method': HTTPmethod,
                    'Cookie': this._cookie,
                },
                mode: 'cors',
                credentials: 'include',
            };

            if (HTTPmethod !== 'GET' && typeof data !== undefined) {
                if (contentType !== 'application/json') {
                    options.body = new FormData(data);
                } else {
                    options.headers['Content-type'] = contentType;
                    options.body = JSON.stringify(data);
                }
            }

            return fetch(backendURL + url, options)
                .then((response) => {
                    return response.json();
                })
                .then((uresp) => {
                    if ((uresp.status >= 200 && uresp.status < 300) || !(uresp.status)) {
                        return uresp;
                    } else {
                        if (uresp.errors) {
                            throw uresp.errors.map((error) => `${error.field}: ${error.defaultMessage}`);
                        } else {
                            throw [uresp.message];
                        }
                    }
                })
                .catch((error) => {
                    throw error;
                });
        }
    }
    window.HttpModule = HttpModule;
    window.backendURL = backendURL;
})();
