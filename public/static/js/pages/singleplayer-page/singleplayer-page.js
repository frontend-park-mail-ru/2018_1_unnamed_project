'use strict';

(function() {
    /**
     * Страница одиночной игры.
     */
    class SingleplayerPage extends window.AbstractPage {
        /**
         * @param {string} parentId Идентификатор родительского узла.
         * @param {string} pageId Желаемый идентификатор страницы.
         */
        constructor({parentId = 'application', pageId = 'singleplayer'} = {}) {
            super({parentId, pageId});
            this.parentNode.insertAdjacentHTML('beforeend', singleplayerPageTemplate({pageId}));
            // this.parentNode.innerHTML += `
            // <section id="${pageId}" hidden>
            //     <img src="static/media/singleplayer.jpg" style="width: 800px">
            // </section>
            // `;
        }
    }

    window.SingleplayerPage = SingleplayerPage;
})();
