import {Page, PageAccessTypes} from "../page";
import uxuiPageTemplate from "./uxui-page.pug";

export class UxUiPage extends Page {
    /**
     *
     */
    constructor() {
        super(uxuiPageTemplate);
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.AnyUser;
    }
}
