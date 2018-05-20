import {Scoreboard, ScoreboardEvents} from "../../components/scoreboard/scoreboard";
import {API} from "../../modules/api";
import bus from "../../modules/bus";
import scoreboardPageTemplate from "./scoreboard-page.pug";

/**
 * Страница списка лидеров.
 */
import {Page, PageAccessTypes} from "../page";
import "./scoreboard-page.css";

export class ScoreboardPage extends Page {
    private _api: API;

    private _scoreboardRoot;
    private _scoreboard;

    /**
     *
     */
    constructor() {
        super(scoreboardPageTemplate);

        this._api = new API();

        this.setLoadPageHandler();
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {ScoreboardPage}
     */
    render(attrs) {
        super.render(attrs);

        this._scoreboardRoot = this.element.querySelector('.js-scoreboard-root');
        this._scoreboard = new Scoreboard({element: this._scoreboardRoot, attrs: this.attrs});

        // Загрузка первой страницы - параметры пагинации не нужны.
        bus.emit(ScoreboardEvents.LoadPage, '');

        this.profileBar.show();

        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }

    /**
     * @private
     * @return {ScoreboardPage}
     */
    private setLoadPageHandler() {
        bus.on(ScoreboardEvents.LoadPage, (pagination) => {
            this._api
                .scoreboard(pagination)
                .then((response) => {
                    if (this._scoreboard) {
                        this._scoreboard.clear();
                        this._scoreboard.render(response);
                    }
                })
                .catch(() => null);
        });

        return this;
    }
}
