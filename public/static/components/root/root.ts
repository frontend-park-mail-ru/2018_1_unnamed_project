import noop from '../../utils/noop';
import {Component} from '../component';

export class Root extends Component {
    private static _Instance: Root;

    constructor() {
        if (Root._Instance) {
            return Root._Instance;
        }

        super({element: document.querySelector('#application'), templateFunction: noop});

        Root._Instance = this;
    }

    get htmlElement() {
        return this.element;
    }
}
