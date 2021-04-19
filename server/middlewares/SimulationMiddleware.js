const { SHOW_ERROR, SHOW_MAINTENANCE } = process.env;

const SimulationMiddleware = function(_, res, next) {
    if (SHOW_ERROR && SHOW_ERROR !== 'false' && SHOW_ERROR !== false) {
        return res.status(500).send({ message: 'Something went wrong.' });
    }

    if (SHOW_MAINTENANCE && SHOW_MAINTENANCE !== 'false' && SHOW_MAINTENANCE !== false) {
        return res.status(503).send({ message: 'Maintenance mode.' });
    }

    next();
};

module.exports = SimulationMiddleware;