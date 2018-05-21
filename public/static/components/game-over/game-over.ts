import {Component} from '../component';
import gameOverTemplate from './game-over.pug';

import './game-over.scss';

export class GameOver extends Component {
    private PLAY_AGAIN_BUTTON_SELECTOR = '.game-over__play-again-button';

    /**
     * @param {object}   element          Элемент, в котором рендерить.
     * @param {function} templateFunction Функция отрисовки pug.
     * @param {object}   attrs            Параметры отрисовки.
     */
    constructor({element, attrs = {}}) {
        super({element, templateFunction: gameOverTemplate, attrs});
    }

    /**
     * @override
     * @param {object} attrs
     * @return {GameOver}
     */
    render(attrs: object) {
        super.render(attrs);
        const playAgain = this.element.querySelector(this.PLAY_AGAIN_BUTTON_SELECTOR);
        playAgain.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.element.parentElement.querySelector('.ocm').hidden = false;
            this.element.remove();
        });
        return this;
    }
}
