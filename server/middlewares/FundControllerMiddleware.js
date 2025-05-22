const ACTIONS = ['eligibility_check', 'received', 'first_use'];
const FUND_KEYS = (process.env.FUND_KEYS || '').split(',');

function validateBsn(bsn) {
    bsn = String(bsn);

    if (!/^[0-9]{8,9}$/.test(bsn)) {
        return false;
    }

    const normalized = bsn.length === 8 ? '0' + bsn : bsn;

    if (normalized === '000000000') {
        return false;
    }

    const weights = [9, 8, 7, 6, 5, 4, 3, 2, -1];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += (normalized.charCodeAt(i) - 48) * weights[i];
    }

    return sum % 11 === 0;
}

const FundControllerMiddleware = function (req, res, next) {
    const { action = null, fund_key = null, bsn = null } = req.body;

    const actionValid = ACTIONS?.includes(action);
    const fundKeyValid = FUND_KEYS?.includes(fund_key);
    const bnsIsValid = validateBsn(bsn?.toString());

    if (!actionValid || !fundKeyValid || !bnsIsValid) {
        return res.status(422).send({
            message: 'Invalid request.',
            errors: {
                ...(!actionValid ? { action: 'Invalid action type' } : {}),
                ...(!fundKeyValid ? { fund_key: 'Invalid fund key' } : {}),
                ...(!bnsIsValid ? { bsn: 'BSN is required and has to be in a valid format.' } : {}),
            }
        });
    }

    next();
};

module.exports = FundControllerMiddleware;