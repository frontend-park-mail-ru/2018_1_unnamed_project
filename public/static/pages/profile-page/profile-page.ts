import {PushLevels} from '../../components/push/push';
import {User, UserEvents} from '../../models/user';
import bus from '../../modules/bus';
import {Page, PageAccessTypes} from '../page';
import profilePageTemplate from './profile-page.pug';

import './profile-page.scss';

export class ProfilePage extends Page {
    /**
     *
     */
    constructor() {
        super(profilePageTemplate);

        this.setAuthenticationDoneHandler();
    }

    /**
     * @private
     * @return {ProfilePage}
     */
    setAuthenticationDoneHandler() {
        bus.on(UserEvents.AuthenticationDone, (newUser) => {
            if (!this.active || !newUser) return;

            this.push.clear()
                .addSharedMessage(`Добро пожаловать, ${newUser.username}`);
        });

        return this;
    }

    /**
     * @override
     * @param {Object} attrs
     * @return {Page}
     */
    render(attrs) {
        super.render(Object.assign({}, attrs, User.currentUser));
        this.push.renderShared({level: PushLevels.Success});
        this.profileBar.show();
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
