(function () {

    const noop = () => null;

    class ProfleBuilder extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
        }

        loadBar(){
            
        }

        render() {
            this._node.innerHTML = 'Oh, hi Clark';
        }

    }

    window.ProfileBuilder = ProfleBuilder;

})();