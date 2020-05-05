const jwt = require("jsonwebtoken");
const createError = require('http-errors');

module.exports = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.body.token || req.query.token;

    if (!token) {
        next(createError(null, "No token provided."));

        return;
    }

    try {
        const data = await jwt.verify(token, req.app.get("api_secret_key"));

        req.data = data;
        next();
    } catch (error) {
        next(createError(null, "Wrong token!"));
    }
};