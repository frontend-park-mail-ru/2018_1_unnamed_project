/* eslint-disable */
'use strict';

(function () {
    /**
     * Билдер форм регистрации и входа.
     */
    class AuthFormsBuilder extends window.AbstractBuilder {
        /**
         * Имя класса узла, в котором необходимо строить форму.
         * @param {string} nodeClassName
         */
        constructor(nodeClassName) {
            super();

            this._nodeClassName = nodeClassName;
            this._upin = this.node.className.slice(7, 9);
            this._signup = this._upin === 'up';
            this.validators = {
                username: {
                    regex: /^([a-zA-Z0-9]{7,})+$/,
                    desc: 'minimum length is 7, only digits and english symbols are allowed',
                },
                password: {
                    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    desc: 'minimum length is 6, only english symbols and at least one digit',

                },
                password_confirmation: {
                    regex: /.*/,
                    desc: 'meh',
                },
                email: {
                    regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
                    desc: 'должен быть email-ом, а ты пашол вон',
                },
            };
        }

        /**
         * Возвращает элемент для вставки разметки.
         * @return {Element}
         */
        get node() {
            return document.getElementsByClassName(this._nodeClassName)[0];
        }

        /**
         * Проверяет, автризован ли пользователь,
         * устанавливает значения жлементов интерфейса
         * и осуществляет роутинг.
         * @param {boolean} buildMultiplayer Показывать ли страницу мультиплеера.
         */
        checkAuth(buildMultiplayer = false) {
            const profileBar = window.application.profileBar;
            const push = window.application.push;
            const router = window.router;

            this.api.getMe()
                .then((response) => {
                    profileBar.innerText = response.username;
                    profileBar.setAttribute('data-section', 'profile');
                    if (buildMultiplayer) {
                        router.navigateTo('multiplayer');
                        push.data = `Welcome back, ${response.username}`;
                        push.render('success');
                    }
                })
                .catch((error) => {
                    profileBar.innerText = 'Unauthorised';
                    profileBar.setAttribute('data-section', 'signin');
                    console.log(error);
                });
        }

        /**
         * Отправка запроса API.
         * @param {Object} event
         * @param {function} callback
         */
        onSubmitAuthForm(event, callback) {
            event.preventDefault();

            const push = window.application.push;

            const form = event.currentTarget;
            const formData = {};

            Object.values(form.elements).forEach((field) => {
                if (field.type !== 'submit') {
                    formData[field.name] = field.value;

                    let validator = this.validators[field.name];

                    if (validator && !field.value.match(validator.regex)) {
                        push.data = `${field.name} ${validator.desc}`;
                    }
                }
            });

            if ('password_confirmation' in formData && formData['password'] !== formData['password_confirmation']) {
                push.data = 'Passwords don\'t match';
            }

            // Делаем сообщения об ошибках неповторяющимися.
            const data = [...new Set(push.data)];
            push.clear();

            for (let i = 0; i < data.length; ++i) {
                push.data = data[i];
            }

            if (push.data.length > 0) {
                push.render('error');
                return;
            }

            const profileBuilder = window.application.profilePage.builder;

            const router = window.router;

            callback(formData)
                .then(() => {
                    this.checkAuth(true);
                    router.navigateTo('profile');
                    profileBuilder.updateBar();
                })
                .catch((errors) => {
                    errors.forEach((error) => push.data = error);
                    push.render('error');
                });
        }

        /**
         * Выход из приложения.
         */
        logoutMe() {
            const multiplayerBuilder = window.application.multiplayerPage.builder;
            const profileBuilder = window.application.profilePage.builder;

            const router = window.router;

            this.api.logout()
                .then(() => {
                    router.navigateTo('menu');
                    profileBuilder.updateBar();
                    multiplayerBuilder.clear();
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        /**
         * Отрисовывает форму.
         */
        render() {
            if (!this.node) return;
            super.render();
            // noinspection JSUnresolvedFunction
            this.node.insertAdjacentHTML('afterbegin', authFormsBuilderTemplate({signup: this._signup}));
        }
    }

    window.AuthFormsBuilder = AuthFormsBuilder;
})();
