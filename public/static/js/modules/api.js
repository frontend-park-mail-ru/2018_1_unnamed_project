(function () {

    class API {
        constructor(){};

        loadMe(callback, async = true) {
            httpModule.request({
                method: 'GET',
                url: '/me',
                callback,
                async
            })
        }

        loadSignin(userData, callback) {
            httpModule.request({
                method: 'POST',
                url: '/signin',
                data: userData,
                callback
            })
        }

        loadSignup(userData, callback) {
            httpModule.request({
                method: 'POST',
                url: '/signup',
                data: userData,
                callback
            })
        }

        loadScoreboard(callback) {
            httpModule.request({
                method: 'GET',
                url: '/scoreboard',
                callback
            })
        }
    };

    window.API = API;

})();