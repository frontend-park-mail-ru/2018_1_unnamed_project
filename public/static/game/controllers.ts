import {GameEvents} from './events';
import gameBus from './game-bus';

export class Controllers {
    private _element;

    /**
     * @param {*} element
     */
    constructor(element) {
        this._element = element;

        this.setClickHandler()
            .setHoverHandler();
    }

    /**
     * Устанавливает обработчик на клики.
     */
    private setClickHandler() {
        this._element.onclick = (evt) => {
            evt.preventDefault();
            gameBus.emit(
                GameEvents.LClick,
                this.getMouseCoordsFromEvent(evt),
            );
        };
        this._element.oncontextmenu = (evt) => {
            evt.preventDefault();
        };

        return this;
    }

    private setHoverHandler() {
        this._element.addEventListener('mousemove', (evt) => {
            gameBus.emit(GameEvents.Hover, this.getMouseCoordsFromEvent(evt));
        });
        this._element.addEventListener('mouseenter', (evt) => {
            gameBus.emit(GameEvents.Hover, this.getMouseCoordsFromEvent(evt));
        });
        this._element.addEventListener('mouseleave', () => {
            gameBus.emit(GameEvents.Unhover);
        });
        return this;
    }

    private getMouseCoordsFromEvent(mouseEvt) {
        return {
            x: mouseEvt.clientX - this._element.offsetLeft,
            y: mouseEvt.clientY - this._element.offsetTop,
        };
    }
}
