const uuid = require('uuid');
const { Router } = require('express');
const FundControllerMiddleware = require('../middlewares/FundControllerMiddleware');

const BSN_NUMBERS = (process.env.BSN_NUMBERS || '').split(',');

const FundsController = function () {
    const router = Router();

    router.post("/funds", function (req, res) {
        const id = uuid.v4();
        const { action, bsn } = req.body;

        if (action === 'eligibility_check') {
            const eligible = BSN_NUMBERS.slice(',').includes(bsn.toString());

            return res.status(200).send({ id, eligible });
        } else if (action === 'received') {
            return res.status(201).send({ id });
        } else if (action === 'first_use') {
            return res.status(201).send({ id });
        }
    }, [FundControllerMiddleware]);

    return router;
}

module.exports = FundsController;