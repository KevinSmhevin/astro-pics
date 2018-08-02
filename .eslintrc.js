module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "semi": "warn",
        "no-console": "off",
        "no-plusplus": "off",
        "no-underscore-dangle": "warn",
        "consistent-return": "warn"
    },
    "plugins": [
        "mocha"
    ],
    "env": {
        "mocha": true,
        "es6": true,
        "commonjs": true,
        "jquery": true,
    }
};