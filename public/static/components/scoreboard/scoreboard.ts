import bus from "../../modules/bus";
import {Component} from "../component";
import scoreboardTemplate from "./scoreboard.pug";

import "./scoreboard.css";

export enum ScoreboardEvents {
    LoadPage = 'load_page',
}

export class Scoreboard extends Component {
    /**
     * @param {Object}   element Элемент, в котором рендерить.
     * @param {Object}   attrs   Параметры отрисовки.
     */
    constructor({element, attrs = {}}) {
        super({element, templateFunction: scoreboardTemplate, attrs});
    }

    /**
     * @param {object} attrs
     * @return {Scoreboard}
     */
    render(attrs) {
        super.render(attrs);

        this.setPaginationHandler('prev', attrs.prevPage)
            .setPaginationHandler('next', attrs.nextPage);

        return this;
    }

    /**
     * @private
     * @param {string} elementId
     * @param {string} pagination
     * @return {Scoreboard}
     */
    private setPaginationHandler(elementId, pagination) {
        const button = document.getElementById(elementId);

        if (pagination) {
            button.onclick = (evt) => {
                evt.preventDefault();
                bus.emit(ScoreboardEvents.LoadPage, pagination);
            };
        } else {
            button.hidden = true;
        }

        return this;
    }
}
