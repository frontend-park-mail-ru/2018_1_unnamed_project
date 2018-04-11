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
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }
}
