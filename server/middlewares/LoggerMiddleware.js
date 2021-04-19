const { LOG_CONECTIONS } = process.env;

const LoggerMiddleware = function(req, _, next) {
    if (LOG_CONECTIONS) {
        console.log('New connection: [' + req.method + '][' + req.url + '] - body: '+ JSON.stringify(req.body) + ', query: ' + JSON.stringify(req.query));
    }

    next();
};

module.exports = LoggerMiddleware;