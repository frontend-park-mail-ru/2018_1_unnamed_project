'use strict';

(function() {
    /**
     * Компонент для орисовки профиля пользователя.
     */
    class ProfileBuilder extends window.AbstractBuilder {
        /**
         * @param {string} selector
         */
        constructor(selector) {
            super(selector);
        }
        
        // noinspection JSMethodCanBeStatic
        /**
         * Метод для обновления строки с аватаром пользователя.
         * @param {string} username
         */
        updateBar(username = '') {
            if (username === '') {
                window.application.signinPage.builder.checkAuth();
            } else {
                window.application.profileBar.innerText = username;
            }
        }

        /**
         *
         */
        render() {
            const backendURI = this.api.backendURI;

            // noinspection JSUnresolvedVariable
            const avatarLink = (this._data.avatarLink ?
                (backendURI + this._data.avatarLink) : 'https://www.shareicon.net/data/128x128/2016/08/05/806962_user_512x512.png');
            // noinspection JSUnresolvedVariable
            this.node.innerHTML = `
            <div class="img-with-text">
                <img class="avatar" src="${avatarLink}"/>
                <a href="#" id="settings" data-section="settings">Settings</a>
            </div>
            <div class="profile-info">
                <h4><i>Username: </i>${this.data.username}</h4>
                <h4><i>Email: </i>${this.data.email}</h4>
                <h4><i>Game rank: </i>${this.data.rank}</h4>
            </div>
            `;

            const settingsHref = document.getElementById('settings');
            settingsHref.addEventListener('click', window.anchorSubmitListener);
        }
    }

    window.ProfileBuilder = ProfileBuilder;
})();
