(function () {

    class Validator{
        constructor(){
            this.validators = {
                username: {
                    regex: /^([a-zA-Z0-9]{7,})+$/,
                    desc: 'minimum lenght is 7, only digits and english symbols are allowed'
                },
                password: {
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    desc: 'minimum lenght is 6, only english symbols and at least one digit'
                },
                password_confirmation: {
                    regex: /.*/,
                    desc: 'meh'
                },
                email: {
                    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                    desc: 'должен быть email-ом, а ты пашол вон'
                },
            };
        }

        validateCredentials(){
                
        }

    }

})();