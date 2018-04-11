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
import registerServiceWorker from "./utils/add-sw";

document.addEventListener('DOMContentLoaded', () => {
    // registerServiceWorker();
    
    const root = document.querySelector('#application');
    
    const pushRoot = document.createElement('div');
    pushRoot.id = 'push-root';
    root.insertAdjacentElement('beforebegin', pushRoot);
    
    const profileBarRoot = document.createElement('div');
    profileBarRoot.id = 'profile-bar-root';
    root.insertAdjacentElement('afterbegin', profileBarRoot);
    
    new Router(root)
        .addRoute('/', MenuPage)
        .addRoute('/multiplayer', MultiplayerPage)
        .addRoute('/profile', ProfilePage)
        .addRoute('/profile/settings', SettingsPage)
        .addRoute('/rules', RulesPage)
        .addRoute('/scoreboard', ScoreboardPage)
        .addRoute('/signin', SigninPage)
        .addRoute('/signup', SignupPage)
        .addRoute('/singleplayer', SingleplayerPage)
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
