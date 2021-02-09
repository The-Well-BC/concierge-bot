const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit = 10) => {
    if(!startTime)
        throw new Error('No start time specified');

    let drops = [];

    return superrare.fetchEvents(startTime, limit)
    .then(res => {
        drops = res;
        return nifty.fetchEvents(startTime, limit)
    }).then(res => {
        drops.push( ...res );
        return drops.filter(item => {
            return new Date(item.date) >= startTime;
        });
    }).catch(e => {
        console.error(e);
        return drops.filter(item => {
            return new Date(item.date) >= startTime;
        });
    });
}
