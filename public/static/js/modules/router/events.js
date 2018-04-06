'use strict';

// noinspection JSUnusedLocalSymbols
define('Router/events', (require) => {
    /**
     * События роутера.
     * Нужны для того, чтобы избежать циклических зависимостей роутера.
     */
    return {
        // Отрисовать конкретную страницу.
        NAVIGATE_TO_PAGE: 'navigate_to',
        // Отрисовать конкретную страницу или, если ее нет, корневую страницу.
        NAVIGATE_TO_NEXT_PAGE_OR_ROOT: 'navigate_to_next',
        // Отрисовка страницы закончена.
        NAVIGATED: 'navigated',
    };
});
