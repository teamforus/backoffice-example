const { LOG_CONECTIONS } = process.env;

const LoggerMiddleware = function(req, _, next) {
    if (LOG_CONECTIONS) {
        const body = JSON.stringify(req.body, null, '    ');
        const query = JSON.stringify(req.query, null, '    ');
        const endpoint = `[${req.method}][${req.url}]`;
        const separator = '-'.repeat(40);

        console.log(`New connection: ${endpoint}\nbody: ${body}\nquery: ${query}\n${separator}`);
    }

    next();
};

module.exports = LoggerMiddleware;