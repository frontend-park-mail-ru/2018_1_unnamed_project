/**
 * Контейнер соединений по вебсокетам.
 * Используется в рамках игровой сессии.
 */
class WSService {
    /**
     *
     */
    constructor() {
        this._connections = new Map();
    }

    /**
     * Добавляет соединение с заданным id в контейнер.
     * @param {string} id
     * @param {object} connection
     * @return {WSService}
     */
    addConnection(id, connection) {
        this._connections.set(id, connection);
        return this;
    }

    /**
     * Отправляет сообщение соединнию с заданным id.
     * Если id некорректен, ничего не делает.
     * @param {Number} forConnection
     * @param {string} type
     * @param {object|*} payload
     * @return {WSService}
     */
    send({forConnection, type, payload}) {
        if (!this._connections.has(forConnection)) {
            return this;
        }

        const ws = this._connections.get(forConnection);
        ws.send(JSON.stringify({
            type,
            payload,
        }));

        return this;
    }

    /**
     * Вызывает send для массива сообщений.
     * @param {[]} messages
     * @return {WSService}
     */
    sendAll(messages) {
        messages.forEach((message) => this.send(message));
        return this;
    }
}

module.export = WSService;
