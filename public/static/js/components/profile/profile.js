(function () {

    const noop = () => null;

    class ProfleBuilder extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
        }

        updateBar(){
            signinBuilder.checkAuth();
        }

        render() {
            this._node.innerHTML = `
                <a href="#" id="logout" data-section="menu">LOG OUT</a>
            `
            document.getElementById("logout").addEventListener('click', signinBuilder.logoutMe);

        }

    }

    window.ProfileBuilder = ProfleBuilder;

})();