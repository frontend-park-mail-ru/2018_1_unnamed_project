(function () {

    class AuthFormsBuilder extends window.AbstractBuilder{

        constructor(node = {}){
            super();
            this._node = node;
        }

        onSubmitAuthForm(event, func) {
            event.preventDefault();
            const form = event.currentTarget;
            const formElements = form.elements;
        
            const formdata = {};
        
            Object.values(form.elements).forEach((field) => {
                if (field.type !== 'submit') {
                    formdata[field.name] = field.value;
                }
            });
        
            func(formdata, function (err, response) {
                push.clear();
                debugger;
                if (err) {
                    push.data = JSON.parse(err.response).desc;
                    push.render('error');
                    return;
                }
        
                api.loadMe((err, me) => {
                    if (err) return;
                    header.innerText = me.username;
                    openSection('realMultiplayer');
                    push.data = response.desc;
                    push.render('success');
                })
            });
        }

        render() {
            if (!(this._node)){
                return;
            }
            const inorup = this._node.className.slice(7,9);
            this._node.innerHTML = `
                <input required class="auth-form__input" type="text" name="username" placeholder="username">
                <input required class="auth-form__input" type="password" name="password" placeholder="password">
                ${
                    ((inorup === 'up') ? `
                    <input required class="auth-form__input" type="password" name="password_confirmation\" placeholder="password again">
                    <input required class="auth-form__input" type="email" name="email" placeholder="email">
                    ` : '')
                }
                <table class="form-buttons">
                    <tr>
                        <td>
                            <input required type="submit" class="auth-form__input js-sign${inorup}-form" value="Sign ${inorup}">
                        </td>
                        ${ ((inorup === 'in') ? `
                        <td>
                            <div class="orsignup">
                                <b class="or">or</b>
                                <a href="#" class="signup" data-section="signup">Sign up</a>
                            </div>
                        </td>
                        ` : '')
                        }
                    </tr>
                </table>
            `
        }
    }

    window.AuthFormsBuilder = AuthFormsBuilder;

})();