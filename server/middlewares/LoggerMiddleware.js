const { LOG_CONNECTIONS } = process.env;

const LoggerMiddleware = function(req, _, next) {
    if (LOG_CONNECTIONS) {
        const body = JSON.stringify(req.body, null, '    ');
        const query = JSON.stringify(req.query, null, '    ');
        const endpoint = `[${req.method}][${req.url}]`;
        const separator = '-'.repeat(40);

        console.log([
            `- Connection: ${endpoint}`,
            `Body: ${body}`,
            `Query: ${query}`,
            separator,
        ].join("\n"));
    }

    next();
};

module.exports = LoggerMiddleware;