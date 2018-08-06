module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "semi": "warn",
        "no-console": "off",
        "no-plusplus": "off",
        "no-underscore-dangle": "warn",
        "consistent-return": "off",
        "func-names": "off",
        "prefer-promise-reject-errors": "off",
        "consistent-return": "off",
        "no-undef": "off",
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