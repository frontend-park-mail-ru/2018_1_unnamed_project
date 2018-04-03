'use strict';

(function() {
    const modules = [];
    const factories = [];

    window.require = (name) => {
        return modules[name] || factories[name] && (modules[name] = factories[name](require)) || null;
    };

    window.define = (name, factory) => {
        factories[name] = factory;
    };
})();
