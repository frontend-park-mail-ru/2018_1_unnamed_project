(function () {

    const noop = () => null;


    class Profle {
        constructor() {
            // this._node = document.querySelector(selector);
        }

        setProfileBar() {
            api.loadMe((err, me) => {
                header.innerHTML = err ? 'Unauthorized' : me.username;
            });
        }

        get data() {

        }

    }

    window.Profile = Profle;

})();