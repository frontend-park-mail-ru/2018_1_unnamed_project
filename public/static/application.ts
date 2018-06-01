import {FloatingPush} from "./components/floating-push/floating-push";
import {Loader} from "./components/loader/loader";
import {ProfileBar} from "./components/profile-bar/profile-bar";
import {Push} from "./components/push/push";
import {Root} from "./components/root/root";
import {GameEvents} from "./game/events";
import gameBus from "./game/game-bus";
import {User, UserEvents} from "./models/user";
import bus from "./modules/bus";
import {Router, RouterEvents} from "./modules/router";
import {MenuPage} from "./pages/menu-page/menu-page";
import {MultiplayerPage} from "./pages/multiplayer-page/multiplayer-page";
import {ProfilePage} from "./pages/profile-page/profile-page";
import {RulesPage} from "./pages/rules-page/rules-page";
import {ScoreboardPage} from "./pages/scoreboard-page/scoreboard-page";
import {SettingsPage} from "./pages/settings-page/settings-page";
import {SigninPage} from "./pages/signin-page/signin-page";
import {SignupPage} from "./pages/signup-page/signup-page";
import {SingleplayerPage} from "./pages/singleplayer-page/singleplayer-page";
import {ApplicationRoutes} from "./routes";
import registerServiceWorker from "./utils/add-sw";

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();

    const root = new Root();

    const PUSH_ROOT_ID = 'push-root';
    const FLOATING_PUSH_ROOT_ID = 'floating-push-root';

    const pushRoot = document.createElement('div');
    pushRoot.id = PUSH_ROOT_ID;
    root.htmlElement.insertAdjacentElement('beforebegin', pushRoot);

    const floatingPushRoot = document.createElement('div');
    floatingPushRoot.id = FLOATING_PUSH_ROOT_ID;
    root.htmlElement.insertAdjacentElement('afterbegin', floatingPushRoot);

    const profileBarRoot = document.createElement('div');
    profileBarRoot.id = 'profile-bar-root';
    root.htmlElement.insertAdjacentElement('afterbegin', profileBarRoot);

    const loaderRoot = document.createElement('div');
    loaderRoot.id = 'loader-root';
    root.htmlElement.insertAdjacentElement('beforebegin', loaderRoot);

    const push = new Push(`#${PUSH_ROOT_ID}`);
    // noinspection JSUnusedLocalSymbols
    const floatingPush = new FloatingPush(`#${FLOATING_PUSH_ROOT_ID}`);

    const profileBar = new ProfileBar({element: profileBarRoot});
    bus.on(UserEvents.CurrentUserChanged, (newUser: User) => {
        if (newUser) {
            profileBar.setAuthorized(newUser.username);
        } else {
            profileBar.setUnauthorized();
        }
    });

    // noinspection JSUnusedLocalSymbols
    const loader = new Loader({element: loaderRoot});

    new Router(root.htmlElement)
        .addRoute(ApplicationRoutes.Menu, MenuPage)
        // .addRoute(ApplicationRoutes.Multiplayer, MultiplayerPage)
        .addRoute(ApplicationRoutes.Profile, ProfilePage)
        .addRoute(ApplicationRoutes.Settings, SettingsPage)
        .addRoute(ApplicationRoutes.Rules, RulesPage)
        .addRoute(ApplicationRoutes.Scoreboard, ScoreboardPage)
        .addRoute(ApplicationRoutes.Signin, SigninPage)
        .addRoute(ApplicationRoutes.Signup, SignupPage)
        .addRoute(ApplicationRoutes.Singleplayer, SingleplayerPage)
        .start();

    // Если пользователь переходит на другую страницу во время игры, мы заканчиваем игру, то есть
    // посылаем по игровой шине сигнал "принудительно заверши игру".
    bus.on(RouterEvents.Navigated, (route: string) => {
        // this.push.sharedSize проверяется из-за того, что возможен редирект
        // типа /profile -> /signin. Если sharedMessages заполнены, то второй раз писать туда не надо.
        if (!route || route === ApplicationRoutes.Singleplayer || push.sharedSize) {
            return;
        }

        gameBus.emit(GameEvents.Terminate);
    });
});
