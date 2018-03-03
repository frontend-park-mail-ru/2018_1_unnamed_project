(function () {

    class API {
        constructor(){};

        loadMe() {
            return httpModule.request({
                method: 'GET',
                url: '/me',
            })
        }

        loadSignin(userData) {
            return httpModule.request({
                method: 'POST',
                url: '/signin',
                data: userData,
            })
        }

        loadSignup(userData) {
            return httpModule.request({
                method: 'POST',
                url: '/signup',
                data: userData,
            })
        }

        loadScoreboard(callback) {
            return httpModule.request({
                method: 'GET',
                url: '/scoreboard',
            })
        }
    };

    window.API = API;

})();