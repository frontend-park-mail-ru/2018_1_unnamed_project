(function () {

    const noop = () => null;

    class ProfleBuilder {
        constructor() {
            // super
        }

        render() {
            console.log('hi shit');
        }

    }

    window.ProfileBuilder = ProfleBuilder;

})();