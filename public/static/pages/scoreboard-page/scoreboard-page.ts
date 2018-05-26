import {Loader} from '../../components/loader/loader';
import {Scoreboard, ScoreboardEvents} from '../../components/scoreboard/scoreboard';
import {API} from '../../modules/api';
import bus from '../../modules/bus';
import {deviceHeight, deviceWidth} from '../../utils/screen-params';
import {Page, PageAccessTypes} from '../page';
import scoreboardPageTemplate from './scoreboard-page.pug';

/**
 * Страница списка лидеров.
 */

export class ScoreboardPage extends Page {
    /**
     * Вычисляет подходящий размер строки таблицы для пагинации, чтобы влезало на экран.
     * @returns {number}
     */
    private static computeSuitablePageSize() {
        const currentWidth = deviceWidth();
        const currentHeight = deviceHeight();

        switch (true) {
            case currentHeight < 400 || currentWidth < 500 && currentHeight < 820:
                return 5;
            default:
                return 10;
        }
    }

    private _api: API;
    private _loader: Loader;

    private _scoreboardRoot;
    private _scoreboard;

    /**
     *
     */
    constructor() {
        super(scoreboardPageTemplate);

        this._api = new API();
        this._loader = new Loader();

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
        bus.emit(ScoreboardEvents.LoadPage, `?limit=${ScoreboardPage.computeSuitablePageSize()}`);

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
            this._loader.show();
            this._api
                .scoreboard(pagination)
                .then((response) => {
                    if (this._scoreboard) {
                        this._scoreboard.clear();
                        this._scoreboard.render(response);
                    }
                    this._loader.hide();
                })
                .catch(() => this._loader.hide());
        });

        return this;
    }
}
