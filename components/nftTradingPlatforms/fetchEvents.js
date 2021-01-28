const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit = 10) => {
    let drops;

    return superrare.fetchEvents(limit)
    .catch(e => {
        console.error(e);
        return [];
    /*
    }).then(res => {
        drops = res;
        return foundation.fetchDrops(limit)
        .catch(e => {
            console.error(e);
            return [];
        })
    */
    }).then(res => {
        drops = res;
        return nifty.fetchEvents(startTime, limit)
        .catch(e => {
            console.error(e);
            return [];
        })
    }).then(res => {
        drops.push( ...res );
        return drops;
    });
}
