/**
 * Модуль для работы с сетью.
 */
export class Http {
    /**
     * Метод DELETE.
     * @param {string | *} uri
     * @return {Promise<Response>}
     */
    static doDelete({uri = '/'} = {}) {
        return this.doRequest({
            method: 'DELETE',
            uri,
        });
    }

    /**
     * Метод GET.
     * @param {string | *} uri
     * @return {Promise<Response>}
     */
    static doGet({uri = '/'} = {}) {
        return this.doRequest({
            uri,
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Метод HEAD.
     * @param {string | *}  uri
     * @return {Promise<Response>}
     */
    static doHead({uri = '/'} = {}) {
        return this.doRequest({
            method: 'HEAD',
            uri,
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Метод PATCH.
     * @param {string | *} uri
     * @param {string | *} contentType
     * @param {Object} data
     * @return {Promise<Response>}
     */
    static doPatch({uri = '/', contentType = 'application/json', data = null} = {}) {
        return this.doRequest({
            method: 'PATCH',
            uri,
            contentType,
            data,
        });
    }

    /**
     * Метод POST.
     * @param {string | *} uri
     * @param {string | *} contentType
     * @param {Object} data
     * @return {Promise<Response>}
     */
    static doPost({uri = '/', contentType = 'application/json', data = null} = {}) {
        return this.doRequest({
            method: 'POST',
            uri,
            contentType,
            data,
        });
    }

    /**
     * Базовый метод запроса.
     * @param {string | *} method Метод запроса.
     * @param {string | *} uri uri запроса.
     * @param {string | *} contentType MIME-Type.
     * @param {Object | HTMLFormElement} data Данные.
     * @return {Promise<Response>}
     */
    private static doRequest({method = 'GET', uri = '/', contentType = 'application/json', data = null} = {}) {
        const options: RequestInit = {
            method,
            headers:     {
                'Access-Control-Request-Method': method,
            },
            mode:        'cors',
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
                    (options as any).body = JSON.stringify(data);
                } else {
                    (options as any).body = new FormData(data);
                }
                break;
            default:
                break;
        }

        return fetch(uri, options)
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                if ((response.status >= 200 && response.status <= 304) || !(response.status)) {
                    return response;
                } else {
                    if ((response as any).errors) {
                        throw (response as any).errors.map((error) => {
                            return `${(error as any).field}: ${(error as any).defaultMessage}`;
                        });
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
}
