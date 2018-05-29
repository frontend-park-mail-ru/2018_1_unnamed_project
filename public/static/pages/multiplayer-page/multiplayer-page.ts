import {PushLevels} from '../../components/message-container';
import {UserEvents} from '../../models/user';
import bus from '../../modules/bus';
import {Page, PageAccessTypes} from '../page';
import multiplayerPageTemplate from './multiplayer-page.pug';

export class MultiplayerPage extends Page {
    /**
     *
     */
    constructor() {
        super(multiplayerPageTemplate);

        this.setAuthenticationDoneHandler();
    }

    /**
     * @private
     * @return {MultiplayerPage}
     */
    setAuthenticationDoneHandler() {
        bus.on(UserEvents.AuthenticationDone, (newUser) => {
            if (!this.active || !newUser) return;

            this.push.addSharedMessage(`Добро пожаловать, ${newUser.username}`);
        });

        return this;
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {MultiplayerPage}
     */
    render(attrs) {
        super.render(attrs);
        this.push.renderShared({level: PushLevels.Success});
        this.profileBar.hide();
        return this;
    }

    /**
     * @override
     * @return {string}
     */
    accessType() {
        return PageAccessTypes.LoggedInUser;
    }
}
