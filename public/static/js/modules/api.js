(function () {

    class API {
        constructor(){}

        me() {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/me',
            });
        }
    
        signin(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/signin',
                contentType: 'application/json',
                data: userData,
            });
        }
        
        signup(userData) {
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/users',
                contentType: 'application/json',
                data: userData,
            });
        }

        logout(){
            return httpModule.request({
                HTTPmethod: 'DELETE',
                url: '/signout',
            });
        }

        scoreboard() {
            return httpModule.request({
                HTTPmethod: 'GET',
                url: '/users/scoreboard',
            });
        }

        uploadAvatar(form){
            return httpModule.request({
                HTTPmethod: 'POST',
                url: '/me/avatar',
                data: form
            });
        }

        deleteAvatar(){
            return httpModule.request({
                HTTPmethod: 'DELETE',
                url: '/me/avatar'
            });
        }
    }

    window.API = API;

})();