'use strict';

const CACHE_NAME = 'ship-collision-cache-v1';

const cacheUrls = [
    '/',
    '/multiplayer',
    '/profile',
    '/profile/settings',
    '/rules',
    '/scoreboard',
    '/signin',
    '/signup',
    '/singleplayer',
    'static/css/main.css',
    'static/css/system-font.css',
    'static/fonts/Comfortaa-Bold.ttf',
    'static/fonts/Comfortaa-Light.ttf',
    'static/fonts/Comfortaa-Regular.ttf',
    'static/fonts/Graduate-Regular.ttf',
    'static/fonts/Megrim.ttf',
    'static/fonts/PatuaOne-Regular.ttf',
    'static/fonts/Righteous-Regular.ttf',
    'static/fonts/ZillaSlabHighlight-Bold.ttf',
    'static/fonts/ZillaSlabHighlight-Regular.ttf',
    'static/fonts/carbo.ttf',
    'static/fonts/sea_font.ttf',
    'static/media/avatar.png',
    'static/media/cabin.jpg',
    'static/media/shingis.jpg',
    'static/media/singleplayer.jpg',
    'static/precompiled/components/form/form.js',
    'static/precompiled/components/menu-ref/menu-ref.js',
    'static/precompiled/components/opponents-count-menu/opponents-count-menu.js',
    'static/precompiled/components/profile-bar/profile-bar.js',
    'static/precompiled/components/push/push.js',
    'static/precompiled/components/score/score.js',
    'static/precompiled/components/scoreboard/scoreboard.js',
    'static/precompiled/pages/menu-page/menu-page.js',
    'static/precompiled/pages/multiplayer-page/multiplayer-page.js',
    'static/precompiled/pages/profile-page/profile-page.js',
    'static/precompiled/pages/rules-page/rules-page.js',
    'static/precompiled/pages/scoreboard-page/scoreboard-page.js',
    'static/precompiled/pages/settings-page/settings-page.js',
    'static/precompiled/pages/signin-page/signin-page.js',
    'static/precompiled/pages/signup-page/signup-page.js',
    'static/precompiled/pages/singleplayer-page/singleplayer-page.js',
    'static/precompiled/pages/uxui-page/uxui-page.js',
    'static/js/application.js',
    'static/js/utils/add-sw.js',
    'static/js/utils/noop.js',
    'static/js/utils/rand.js',
    'static/js/components/component/component.js',
    'static/js/components/form/events.js',
    'static/js/components/form/form.css',
    'static/js/components/form/form.js',
    'static/js/components/form/form.pug',
    'static/js/components/menu-ref/menu-ref.pug',
    'static/js/components/opponents-count-menu/opponents-count-menu.css',
    'static/js/components/opponents-count-menu/opponents-count-menu.js',
    'static/js/components/opponents-count-menu/opponents-count-menu.pug',
    'static/js/components/profile-bar/profile-bar.css',
    'static/js/components/profile-bar/profile-bar.js',
    'static/js/components/profile-bar/profile-bar.pug',
    'static/js/components/push/levels.js',
    'static/js/components/push/push.css',
    'static/js/components/push/push.js',
    'static/js/components/push/push.pug',
    'static/js/components/score/score.css',
    'static/js/components/score/score.js',
    'static/js/components/score/score.pug',
    'static/js/components/scoreboard/events.js',
    'static/js/components/scoreboard/scoreboard.css',
    'static/js/components/scoreboard/scoreboard.js',
    'static/js/components/scoreboard/scoreboard.pug',
    'static/js/models/user/events.js',
    'static/js/models/user/user.js',
    'static/js/pages/menu-page/menu-page.css',
    'static/js/pages/menu-page/menu-page.js',
    'static/js/pages/menu-page/menu-page.pug',
    'static/js/pages/multiplayer-page/multiplayer-page.css',
    'static/js/pages/multiplayer-page/multiplayer-page.js',
    'static/js/pages/multiplayer-page/multiplayer-page.pug',
    'static/js/pages/page/access-types.js',
    'static/js/pages/page/page.js',
    'static/js/pages/profile-page/profile-page.css',
    'static/js/pages/profile-page/profile-page.js',
    'static/js/pages/profile-page/profile-page.pug',
    'static/js/pages/rules-page/rules-page.css',
    'static/js/pages/rules-page/rules-page.js',
    'static/js/pages/rules-page/rules-page.pug',
    'static/js/pages/scoreboard-page/scoreboard-page.css',
    'static/js/pages/scoreboard-page/scoreboard-page.js',
    'static/js/pages/scoreboard-page/scoreboard-page.pug',
    'static/js/pages/settings-page/settings-page.css',
    'static/js/pages/settings-page/settings-page.js',
    'static/js/pages/settings-page/settings-page.pug',
    'static/js/pages/signin-page/signin-page.css',
    'static/js/pages/signin-page/signin-page.js',
    'static/js/pages/signin-page/signin-page.pug',
    'static/js/pages/signup-page/signup-page.css',
    'static/js/pages/signup-page/signup-page.js',
    'static/js/pages/signup-page/signup-page.pug',
    'static/js/pages/singleplayer-page/events.js',
    'static/js/pages/singleplayer-page/singleplayer-page.css',
    'static/js/pages/singleplayer-page/singleplayer-page.js',
    'static/js/pages/singleplayer-page/singleplayer-page.pug',
    'static/js/pages/uxui-page/uxui-page.js',
    'static/js/pages/uxui-page/uxui-page.pug',
    'static/js/modules/api.js',
    'static/js/modules/bus.js',
    'static/js/modules/event-bus.js',
    'static/js/modules/http.js',
    'static/js/modules/module-system.js',
    'static/js/modules/validator-factory.js',
    'static/js/modules/graphics/figure.js',
    'static/js/modules/graphics/rectangle.js',
    'static/js/modules/graphics/scene.js',
    'static/js/modules/router/events.js',
    'static/js/modules/router/router.js',
    'static/js/modules/game/controllers.js',
    'static/js/modules/game/game/game.js',
    'static/js/modules/game/game/modes.js',
    'static/js/modules/game/game/players.js',
    'static/js/modules/game/core/bus.js',
    'static/js/modules/game/core/core.js',
    'static/js/modules/game/core/events.js',
    'static/js/modules/game/core/online-core.js',
    'static/js/modules/game/core/offline-core/bot.js',
    'static/js/modules/game/core/offline-core/move-time-hanlder.js',
    'static/js/modules/game/core/offline-core/offline-core.js',
    'static/js/modules/game/field/calc-delegate.js',
    'static/js/modules/game/field/field.js',
    'static/js/modules/game/field/setup-validator.js',
    'static/js/modules/game/field/cell/cell.js',
    'static/js/modules/game/field/cell/status-mapper.js',
    'static/js/modules/game/field/cell/status.js'
];

this.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(cacheUrls))
            .catch((err) => console.log('Cache error!!!'))
    );
});

this.addEventListener('fetch', (evt) => {
    if (navigator.onLine) {
        return fetch(evt.request);
    }

    evt.respondWith(
        caches
            .match(evt.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    return fetch(evt.request);
                }
            })
            .catch((err) => console.log('unable to fetch resource ', evt.request.url))
    );
});
