/* eslint-disable */
'use strict';

(function() {

    const AbstractBuilder = window.AbstractBuilder;

    const multiplayerBuilder = window.application.multiplayerPage.builder;
    const profileBar = window.application.profileBar;
    const profileBuilder = window.application.profilePage.builder;
    const push = window.application.push;
    const router = window._router;

    /**
     * Билдер форм регистрации и входа.
     */
    class AuthFormsBuilder extends AbstractBuilder {
        /**
         * Имя класса узла, в котором необходимо строить форму.
         * @param {string} nodeClassName
         */
        constructor(nodeClassName) {
            super();

            this._nodeClassName = nodeClassName;
            this._upin = this.node.className.slice(7, 9);
            this._signup = this._upin === 'up';
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
            this.api.getMe()
                .then((response) => {
                    profileBar.innerText = response.username;
                    profileBar.setAttribute('messages-section', 'profile');
                    if (buildMultiplayer) {
                        router.navigateTo('multiplayer');
                        push.data = `Welcome back, ${response.username}`;
                        push.render('success');
                    }
                })
                .catch((error) => {
                    profileBar.innerText = 'Unauthorised';
                    profileBar.setAttribute('messages-section', 'signin');
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

            const form = event.currentTarget;
            const result = this.validator.validateCredentials(form, push, this._signup);
            if (result.err){
                return;
            }

            callback(result.formData)
                .then(() => {
                    this.checkAuth(true);
                    router.navigateTo('profile');
                    profileBuilder.updateBar();
                })
                .catch((errors) => {
                    try {
                        errors.forEach((error) => push.data = error);
                        push.render('error');
                    } catch (error) {
                        console.error(errors);
                    }
                });
        }

        /**
         * Выход из приложения.
         */
        logoutMe() {
            event.preventDefault();

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
