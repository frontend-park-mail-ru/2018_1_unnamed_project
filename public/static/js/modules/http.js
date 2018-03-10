'use strict';

(function () {

	class HttpModule {

		static doRequest({method = 'GET', url = '/', contentType = 'application/json', data = null} = {}) {
			const options = {
				method,
				headers: {
					'Access-Control-Request-Method': method
				},
				mode: 'cors',
				credentials: 'include',
			};

			switch (true) {
				case !data:
					break;
				case method === 'PATCH':
				case method === 'POST':
				case method === 'PUT':
					if (contentType === 'application/json') {
						options.headers['Content-Type'] = contentType;
						options.body = JSON.stringify(data);
					} else {
						options.body = new FormData(data)
					}
					break;
				default:
					break;
			}

			return fetch(url, options)
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

		static doDelete({url = '/'} = {}) {
			return this.doRequest({
				method: 'DELETE',
				url
			});
		}

		static doGet({url = '/'} = {}) {
			return this.doRequest({
				url
			});
		}

		// noinspection JSUnusedGlobalSymbols
		static doHead({url = '/'} = {}) {
			return this.doRequest({
				method: 'HEAD',
				url
			});
		}

		// noinspection JSUnusedGlobalSymbols
		static doPatch({url = '/', contentType = 'application/json', data = null} = {}) {
			return this.doRequest({
				method: 'PATCH',
				url,
				contentType,
				data
			});
		}

		static doPost({url = '/', contentType = 'application/json', data = null} = {}) {
			return this.doRequest({
				method: 'POST',
				url,
				contentType,
				data
			});
		}
	}

	window.HttpModule = HttpModule;
})();