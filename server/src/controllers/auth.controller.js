const auth = require("../services/auth.service");

const login = (req, res, next) => {
    auth.authenticate();
    next();
};

const logout = (req, res, next) => {
    res.send("Not implemented");
};

const signup = (req, res, next) => {
    res.send("Not implemented");
};

module.exports = {
    login,
    logout,
    signup,
};
