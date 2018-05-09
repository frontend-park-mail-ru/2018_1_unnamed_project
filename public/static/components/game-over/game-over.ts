import {Component} from "../component";
import "./game-over.css";
import gameOverTemplate from "./game-over.pug";

export class GameOver extends Component {

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
        const playAgain = this.element.querySelector('.game__game_over__play_again__button');
        playAgain.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.element.parentElement.querySelector('.ocm').hidden = false;
            this.element.remove();
        });
        return this;
    }
}
