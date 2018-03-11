'use strict';

(function() {
    /**
     * Модуль для работы с сетью.
     */
    class HttpModule {
        /**
         * Базовый метод запроса.
         * @param {string | *} method Метод запроса.
         * @param {string | *} url URL запроса.
         * @param {string | *} contentType MIME-Type.
         * @param {Object | HTMLFormElement} data Данные.
         * @return {Promise<Response>}
         */
        static doRequest({method = 'GET', url = '/', contentType = 'application/json', data = null} = {}) {
            const options = {
                method,
                headers: {
                    'Access-Control-Request-Method': method,
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
                    options.body = new FormData(data);
                }
                break;
            default:
                break;
            }

            return fetch(url, options)
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    if ((response.status >= 200 && response.status < 300) || !(response.status)) {
                        return response;
                    } else {
                        // noinspection JSUnresolvedVariable
                        if (response.errors) {
                            // noinspection JSUnresolvedVariable
                            throw response.errors.map((error) => `${error.field}: ${error.defaultMessage}`);
                        } else {
                            // eslint-disable-next-line
                            throw [response.message];
                        }
                    }
                })
                .catch((error) => {
                    throw error;
                });
        }

        /**
         * Метод DELETE.
         * @param {string | *} url
         * @return {Promise<Response>}
         */
        static doDelete({url = '/'} = {}) {
            return this.doRequest({
                method: 'DELETE',
                url,
            });
        }

        /**
         * Метод GET.
         * @param {string | *} url
         * @return {Promise<Response>}
         */
        static doGet({url = '/'} = {}) {
            return this.doRequest({
                url,
            });
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Метод HEAD.
         * @param {string | *}  url
         * @return {Promise<Response>}
         */
        static doHead({url = '/'} = {}) {
            return this.doRequest({
                method: 'HEAD',
                url,
            });
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Метод PATCH.
         * @param {string | *} url
         * @param {string | *} contentType
         * @param {Object} data
         * @return {Promise<Response>}
         */
        static doPatch({url = '/', contentType = 'application/json', data = null} = {}) {
            return this.doRequest({
                method: 'PATCH',
                url,
                contentType,
                data,
            });
        }

        /**
         * Метод POST.
         * @param {string | *} url
         * @param {string | *} contentType
         * @param {Object} data
         * @return {Promise<Response>}
         */
        static doPost({url = '/', contentType = 'application/json', data = null} = {}) {
            return this.doRequest({
                method: 'POST',
                url,
                contentType,
                data,
            });
        }
    }

    window.HttpModule = HttpModule;
})();
