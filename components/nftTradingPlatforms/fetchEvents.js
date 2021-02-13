const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit = 10) => {
    if(!startTime)
        throw new Error('No start time specified');

    let platforms = [foundation, superrare, nifty, zora];

    let drops = [];

    return Promise.all( platforms.map(p => {
        return p.fetchEvents(startTime, limit)
    })).then(res => res.flat());
}
