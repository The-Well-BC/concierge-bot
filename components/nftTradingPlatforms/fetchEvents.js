const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit = 10) => {
    let drops = [];

    return superrare.fetchEvents(startTime, limit)
    .then(res => {
        drops = res;
        return nifty.fetchEvents(startTime, limit)
    }).then(res => {
        drops.push( ...res );
        return drops;
    }).catch(e => {
        console.error(e);
        return drops;
    });
}
