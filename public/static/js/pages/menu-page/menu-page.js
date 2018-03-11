'use strict';

(function() {
    /**
     * Страница меню.
     */
    class MenuPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'menu'} = {}) {
            super({parentId, pageId});
            this.parentNode.innerHTML += `
            <section id="menu" hidden>
                <div class="header">SHIP<br>COLLISION</div>
                <hr>
                <div class="menu">
                    <ul>
                        <li>
                            <a href="#" data-section="multiplayer">Multiplayer</a>
                        </li>
                        <li>
                            <a href="#" data-section="singleplayer">Singleplayer</a>
                        </li>
                        <li>
                            <a href="#" data-section="scoreboard">Scoreboard</a>
                        </li>
                        <li>
                            <a href="#" data-section="rules">Rules</a>
                        </li>
                    </ul>
                </div>
            </section>
            `;
        }

        // noinspection JSUnusedGlobalSymbols
        /**
         * Отображает страницу.
         */
        show() {
            super.show();
            window.application.signinPage.builder.checkAuth();
        }
    }

    window.MenuPage = MenuPage;
})();
