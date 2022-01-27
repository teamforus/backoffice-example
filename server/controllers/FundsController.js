const uuid = require('uuid');
const { Router } = require('express');
const FundControllerMiddleware = require('../middlewares/FundControllerMiddleware');

const BSN_NUMBERS_ELIGIBLE = (process.env.BSN_NUMBERS_ELIGIBLE || '').split(',');
const BSN_NUMBERS_RESIDENTS = (process.env.BSN_NUMBERS_RESIDENTS || '').split(',');
const OVERWRITE_ID = process.env.OVERWRITE_ID === 'true' ? true : false;

const FundsController = function() {
    const router = Router();

    router.post("/funds", function(req, res) {
        const id = OVERWRITE_ID ? uuid.v4() : null;
        const { action, bsn } = req.body;
        const resident = BSN_NUMBERS_RESIDENTS.slice(',').includes(bsn.toString());
        const eligible = BSN_NUMBERS_ELIGIBLE.slice(',').includes(bsn.toString());

        switch (action) {
            case 'received': return res.status(201).send({ ...(id ? { id } : {}) });
            case 'first_use': return res.status(201).send({ ...(id ? { id } : {}) });
            case 'eligibility_check': return res.status(200).send({ ...(id ? { id } : {}), eligible });
            case 'residency_check': return res.status(200).send({ ...(id ? { id } : {}), resident });
        }

        return res.status(404).send({ message: 'Not found.' });
    }, [FundControllerMiddleware]);

    return router;
}

module.exports = FundsController;