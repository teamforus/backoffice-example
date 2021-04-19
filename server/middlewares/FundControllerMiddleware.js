const ACTIONS = ['eligibility_check', 'received', 'first_use'];
const FUND_KEYS = (process.env.FUND_KEYS || '').split(',');

const FundControllerMiddleware = function(req, res, next) {
    const { action, fund_key, bsn } = req.body;

    const actionValid = ACTIONS.includes(action);
    const fundKeyValid = FUND_KEYS.includes(fund_key);
    const bnsIsValid = bsn.toString().length == 9;

    if (!actionValid || !fundKeyValid || !bnsIsValid) {
        return res.status(422).send({
            message: 'Invalid request.',
            errors: {
                ...(!actionValid ? { action: 'Invalid action type' } : {}),
                ...(!fundKeyValid ? { fund_key: 'Invalid fund key' } : {}),
                ...(!bnsIsValid ? { bsn: 'BSN is required and has to be 9 characters long.' } : {}),
            }
        });
    }

    next();
};

module.exports = FundControllerMiddleware;