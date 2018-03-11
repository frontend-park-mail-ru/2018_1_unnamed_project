'use strict';

(function() {
    /**
     * Вспомогательная функция для преобразования HTML в элемент для вставки.
     * @param {string} html
     * @return {Node | null}
     */
    function htmlToElement(html) {
        let tmpWrapper = document.createElement('div');
        html = html.trim();
        tmpWrapper.innerHTML = html;
        return tmpWrapper.firstChild;
    }

    window.htmlToElement = htmlToElement;
})();
