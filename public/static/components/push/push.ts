import {Component} from "../component";
import pushTemplate from "./push.pug";

import "./push.css";

export enum PushLevels {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}

export class Push extends Component {
    private static _Instance: Push;
    private _messages;
    private _sharedMessages;

    constructor() {
        if (Push._Instance) {
            return Push._Instance;
        }

        super({
            attrs:            {},
            element:          document.querySelector('#push-root'),
            templateFunction: pushTemplate,
        });

        // Сообщения, доступные только текущей странице.
        this._messages = new Set();
        // Сообщения, которые должны отобразиться на следующей странице.
        // Это буфер сообщений, разделяемый между страницами.
        this._sharedMessages = new Set();

        Push._Instance = this;
    }

    /**
     * Добавляет сообщение в буфер текущей страницы.
     * @param {string} message
     * @return {Push}
     */
    addMessage(message) {
        this._messages.add(message);
        return this;
    }

    /**
     * Добавляет сообщение в разделяемый буфер.
     * @param {string} message
     */
    addSharedMessage(message) {
        this._sharedMessages.add(message);
    }

    /**
     * Очищает буфер сообщений для текущей страницы.
     * @return {Push}
     */
    clearMessages() {
        this._messages.clear();
        return this;
    }

    /**
     * Очищает разделяемый буфер сообщений.
     * @return {Push}
     */
    clearSharedMessages() {
        this._sharedMessages.clear();
        return this;
    }

    /**
     * Очищает содержимое компонента и буфер сообщений для текущей страницы.
     * @note Разделяемый буфер надо чистить явно!
     * @override
     */
    clear() {
        super.clear();
        this._messages.clear();
        return this;
    }

    /**
     * @override
     * @param {Object} level
     * @return {Push}
     */
    render({level = PushLevels.Info}) {
        if (this._messages.em) return this;

        super.render({
            level,
            messages: [...this._messages],
        });
        this.clearMessages();

        return this;
    }

    /**
     * Отрисовывает компонент с разделяемыми сообщениями.
     * @param {string} level
     * @return {Push}
     */
    renderShared({level = PushLevels.Info}) {
        if (this._sharedMessages.empty) return this;

        super.render({
            level,
            messages: [...this._sharedMessages],
        });
        this.clearSharedMessages();

        return this;
    }
}