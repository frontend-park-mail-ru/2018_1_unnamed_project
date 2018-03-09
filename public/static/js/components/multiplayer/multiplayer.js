(function() {
    class Multiplayer extends window.AbstractBuilder {
        constructor(selector) {
            super(selector);
        }

        render() {
            if (!this._node) return;
            this._node.innerHTML = `
                <img src="static/media/shingis.jpg">
            `;
        }
    }

    window.Multiplayer = Multiplayer;
})();
