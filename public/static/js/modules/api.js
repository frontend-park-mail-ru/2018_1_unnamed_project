(function () {

    class API {
        constructor(){};

        me() {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/me',
            })
        }
    
        signin(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/signin',
                data: userData,
            })
        }
        
        signup(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/users',
                data: userData,
            })
        }

        logout(){
            return httpModule.request({
                HTTPmethod: 'DELETE',
                url: '/signout',
            })
        }

        scoreboard(callback) {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/users/scoreboard',
            })
        }
    };

    window.API = API;

})();