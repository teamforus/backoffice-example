const RequestTypeMiddleware = function(req, res, next) {
    if (req.headers['accept'] != 'application/json') {
        return res.status(403).send({
            error: 'Invalid Accept header.',
        });
    }

    if (req.headers['content-type'] != 'application/json') {
        return res.status(403).send({
            message: 'Invalid Content-Type header.',
        });
    }

    next();
};

module.exports = RequestTypeMiddleware;