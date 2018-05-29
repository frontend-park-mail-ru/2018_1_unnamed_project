import {Component} from "./component";

export enum PushLevels {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}

export abstract class MessageContainer extends Component {
    protected readonly messages: Set<string>;
    protected readonly sharedMessages: Set<string>;

    protected constructor({attrs = {}, element, templateFunction}) {
        super({attrs, element, templateFunction});
        // Сообщения, доступные только текущей странице.
        this.messages = new Set();
        // Сообщения, которые должны отобразиться на следующей странице.
        // Это буфер сообщений, разделяемый между страницами.
        this.sharedMessages = new Set();
    }

    public get size(): number {
        return this.messages.size;
    }

    public get sharedSize(): number {
        return this.sharedMessages.size;
    }

    /**
     * Добавляет сообщение в буфер текущей страницы.
     * @param {string} message
     * @return {Push}
     */
    addMessage(message) {
        this.messages.add(message);
        return this;
    }

    /**
     * Добавляет сообщение в разделяемый буфер.
     * @param {string} message
     */
    addSharedMessage(message) {
        this.sharedMessages.add(message);
        return this;
    }

    /**
     * Очищает буфер сообщений для текущей страницы.
     * @return {Push}
     */
    clearMessages() {
        this.messages.clear();
        return this;
    }

    /**
     * Очищает разделяемый буфер сообщений.
     * @return {Push}
     */
    clearSharedMessages() {
        this.sharedMessages.clear();
        return this;
    }

    /**
     * Очищает содержимое компонента и буфер сообщений для текущей страницы.
     * @note Разделяемый буфер надо чистить явно!
     * @override
     */
    clear() {
        super.clear();
        this.messages.clear();
        return this;
    }

    /**
     * @override
     * @param {Object} level
     * @return {Push}
     */
    render({level = PushLevels.Info} = {}) {
        if ((this.messages as any).em) return this;

        super.render({
            level,
            messages: [...this.messages],
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
        if (!this.sharedMessages.size) return this;

        super.render({
            level,
            messages: [...this.sharedMessages],
        });
        this.clearSharedMessages();

        return this;
    }
}
