const uuid = require('uuid');
const { Router } = require('express');

const StatusController = function () {
    const router = Router();

    router.get("/status", function (req, res) {
        return res.send({
            status: 'ok',
        });
    });

    return router;
}

module.exports = StatusController;