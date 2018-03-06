(function () {

    class API {
        constructor(){};

        loadMe() {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/me',
            })
        }
    
        loadSignin(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/signin',
                data: userData,
            })
        }

        loadSignup(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/signup',
                data: userData,
            })
        }

        loadScoreboard(callback) {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/users/scoreboard',
            })
        }
    };

    window.API = API;

})();