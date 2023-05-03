const uuid = require('uuid');
const { Router } = require('express');
const FundControllerMiddleware = require('../middlewares/FundControllerMiddleware');
const { LOG_CONNECTIONS } = process.env;

const BSN_NUMBERS_ELIGIBLE = (process.env.BSN_NUMBERS_ELIGIBLE || '').split(',');
const BSN_NUMBERS_RESIDENTS = (process.env.BSN_NUMBERS_RESIDENTS || '').split(',');
const BSN_NUMBERS_PARTNERS = (process.env.BSN_NUMBERS_PARTNERS || '').split(',');
const OVERWRITE_ID = process.env.OVERWRITE_ID === 'true';

const FundsController = function() {
    const router = Router();

    router.post("/funds", function(req, res) {
        const id = OVERWRITE_ID ? uuid.v4() : null;
        const { action, bsn } = req.body;

        const resident = BSN_NUMBERS_RESIDENTS.slice(',').includes(bsn.toString());
        const eligible = BSN_NUMBERS_ELIGIBLE.slice(',').includes(bsn.toString());

        const partner = BSN_NUMBERS_PARTNERS.filter((partner) => partner.split('=')[0] === bsn.toString())[0];
        const partner_bsn = partner ? partner.split('=')[1] : null;

        const response = (status, data) => {
            if (LOG_CONNECTIONS) {
                console.log([
                    `- Response for: ${action}`,
                    `Data: ${JSON.stringify(data, null, '    ')}`,
                    '-'.repeat(40),
                ].join("\n"));
            }

            return res.status(status).send(data);
        };

        switch (action) {
            case 'received': return response(201, { ...(id ? { id } : {}) });
            case 'first_use': return response(201, { ...(id ? { id } : {}) });
            case 'eligibility_check': return response(200, { ...(id ? { id } : {}), eligible });
            case 'residency_check': return response(200, { ...(id ? { id } : {}), resident });
            case 'partner_bsn': return response(200, { ...(id ? { id } : {}), partner_bsn });
        }

        return res.status(404).send({ message: 'Not found.' });
    }, [FundControllerMiddleware]);

    return router;
}

module.exports = FundsController;