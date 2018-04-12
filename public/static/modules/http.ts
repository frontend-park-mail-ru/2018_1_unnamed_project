/**
 * Модуль для работы с сетью.
 */

export type HttpResponse = Promise<any>;

export class Http {
    /**
     * Метод DELETE.
     * @param {string | *} uri
     * @return {Promise<Response>}
     */
    public static doDelete({uri = '/'} = {}): HttpResponse {
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
    public static doGet({uri = '/'} = {}): HttpResponse {
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
    public static doHead({uri = '/'} = {}): HttpResponse {
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
    public static doPatch({uri = '/', contentType = 'application/json', data = null} = {}): HttpResponse {
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
    public static doPost({uri = '/', contentType = 'application/json', data = null} = {}): HttpResponse {
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
    private static doRequest({method = 'GET', uri = '/', contentType = 'application/json', data = null} = {}):
    HttpResponse  {
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
                    options.body = JSON.stringify(data);
                } else {
                    options.body = new FormData(data);
                }
                break;
            default:
                break;
        }
        
        return fetch(uri, options)
            .then((response: Response) => {
                return response.json();
            })
            .then((response: any) => {
                if ((response.status >= 200 && response.status <= 304) || !(response.status)) {
                    return response;
                } else {
                    if ((response.status >= 200 && response.status <= 304) || !(response.status)) {
                        return response;
                    } else {
                        if (response.errors) {
                            throw response.errors.map((error) => `${error.field}: ${error.defaultMessage}`);
                        } else {
                            throw [response.message];
                        }
                    }
                }
            })
            .catch((error) => {
                throw error;
            });
    }
}
