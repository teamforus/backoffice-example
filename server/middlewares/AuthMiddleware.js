const { AUTH_TOKEN } = process.env;

const AuthMiddleware = function(req, res, next) {
    if (!req.headers['authorization']) {
        return res.status(403).send({ error: 'Not Authenticated.' });
    }

    if (req.headers['authorization'] != AUTH_TOKEN) {
        return res.status(403).send({ error: 'Invalid Access Token.' });
    }

    next();
};

module.exports = AuthMiddleware;