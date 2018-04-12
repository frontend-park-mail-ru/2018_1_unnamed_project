import {ProfileBar} from "./components/profile-bar/profile-bar";
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
    
    const root = document.querySelector('#application');
    
    const pushRoot = document.createElement('div');
    pushRoot.id = 'push-root';
    root.insertAdjacentElement('beforebegin', pushRoot);
    
    const profileBarRoot = document.createElement('div');
    profileBarRoot.id = 'profile-bar-root';
    root.insertAdjacentElement('afterbegin', profileBarRoot);
    
    new Router(root)
        .addRoute(ApplicationRoutes.Menu, MenuPage)
        .addRoute(ApplicationRoutes.Multiplayer, MultiplayerPage)
        .addRoute(ApplicationRoutes.Profile, ProfilePage)
        .addRoute(ApplicationRoutes.Settings, SettingsPage)
        .addRoute(ApplicationRoutes.Rules, RulesPage)
        .addRoute(ApplicationRoutes.Scoreboard, ScoreboardPage)
        .addRoute(ApplicationRoutes.Signin, SigninPage)
        .addRoute(ApplicationRoutes.Signup, SignupPage)
        .addRoute(ApplicationRoutes.Singleplayer, SingleplayerPage)
        .start();
    
    const profileBar = new ProfileBar({element: profileBarRoot});
    bus.on(UserEvents.CurrentUserChanged, (newUser: User) => {
        if (newUser) {
            profileBar.setAuthorized(newUser.username);
        } else {
            profileBar.setUnauthorized();
        }
    });
    
    bus.on(RouterEvents.Navigated, () => profileBar.show());
});
