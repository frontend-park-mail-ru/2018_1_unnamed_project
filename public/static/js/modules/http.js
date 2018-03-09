(function () {

	// const BACKEND_URI = 'http://localhost:8080'; // debug
	const BACKEND_URI = 'https://dev-api-shipcollision.herokuapp.com'; // production

	class HttpModule {

		request({HTTPmethod = 'GET', url = '/', contentType, data = {}} = {}) {
			const options = {
				method: HTTPmethod,
				headers: {
					'Access-Control-Request-Method': HTTPmethod
				},
				mode: 'cors',
				credentials: 'include',
			};

			if (HTTPmethod !== 'GET' && typeof data !== 'undefined') {
				if (contentType !== 'application/json') {
					options.body = new FormData(data);
				} else {
					options.headers['Content-type'] = contentType;
					options.body = JSON.stringify(data);
				}
			}

			return fetch(BACKEND_URI + url, options)
				.then(response => {
					return response.json();
				})
				.then(response => {
					if ((response.status >= 200 && response.status < 300) || !(response.status)) {
						return response;
					} else {
						// noinspection JSUnresolvedVariable
						if (response.errors) {
							// noinspection JSUnresolvedVariable
							throw response.errors.map(error => `${error.field}: ${error.defaultMessage}`)
						} else {
							throw [response.message];
						}
					}
				})
				.catch(error => {
					throw error;
				});
		}
	}

	window.HttpModule = HttpModule;
	window.backendURL = BACKEND_URI;
})();