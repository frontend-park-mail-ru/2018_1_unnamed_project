import {Push} from '../components/push/push';
import {GameEvents} from '../game/events';
import gameBus from '../game/game-bus';
import {API} from './api';

export class WS {
    private static _Instance: WS;

    private static handleMessage(evt) {
        const text = evt.data;

        try {
            const {type, payload} = JSON.parse(text);
            WS.resolveMessage(type, payload);
        } catch (e) {
            return;
        }
    }

    private static resolveMessage(type, payload) {
        gameBus.emit(type as GameEvents, payload);
    }

    private readonly _push: Push;
    private readonly _ws: WebSocket;

    constructor() {
        if (WS._Instance) {
            return WS._Instance;
        }

        const api = new API();
        const address = `${api.backendURI.replace(/https?/, 'ws')}/game`;

        this._push = new Push();
        this._ws = new WebSocket(address);

        this._ws.onopen = () => {
            this._ws.onmessage = (msg) => WS.handleMessage(msg);
        };

        WS._Instance = this;
    }

    public sendMessage(type, payload) {
        this._ws.send(JSON.stringify({type, payload}));
    }
}
