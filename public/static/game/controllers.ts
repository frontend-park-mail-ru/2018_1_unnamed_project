import {GameEvents} from "./events";
import gameBus from "./game-bus";

export class Controllers {
    private _element;

    /**
     * @param {*} element
     */
    constructor(element) {
        this._element = element;

        this.setClickHandler();
    }

    /**
     * Устанавливает обработчик на клики.
     */
    setClickHandler() {
        this._element.onclick = (evt) => {
            evt.preventDefault();
            console.log(
                'LCLICK',
                {
                    x: evt.clientX - this._element.offsetLeft,
                    y: evt.clientY - this._element.offsetTop,
                },
            );
            gameBus.emit(
                GameEvents.LClick,
                {
                    x: evt.clientX - this._element.offsetLeft,
                    y: evt.clientY - this._element.offsetTop,
                },
            );
        };
        this._element.oncontextmenu = (evt) => {
            evt.preventDefault();
            console.log(
                'RCLICK',
                {
                    x: evt.clientX - this._element.offsetLeft,
                    y: evt.clientY - this._element.offsetTop,
                },
            );
            gameBus.emit(
                GameEvents.RClick,
                {
                    x: evt.clientX - this._element.offsetLeft,
                    y: evt.clientY - this._element.offsetTop,
                },
            );
        };
    }
}
