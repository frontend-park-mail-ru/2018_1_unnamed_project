import {Page, PageAccessTypes} from "../page";
import rulesPageTemplate from "./rules-page.pug";

import "./rules-page.css";

export class RulesPage extends Page {
    /**
     *
     */
    constructor() {
        super(rulesPageTemplate);
    }

    /**
     * @override
     * @param {object} attrs
     * @returns {RulesPage}
     */
    render(attrs: object): RulesPage {
        super.render(attrs);
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
}
