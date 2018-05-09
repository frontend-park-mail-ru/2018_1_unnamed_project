module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "google",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        'max-len': [2, {
            code: 120,
            tabWidth: 2,
            ignoreUrls: true,
            ignorePattern: '^goog\.(module|require)',
            ignorePattern: '.*\/.*\/'
        }],
    }
};
