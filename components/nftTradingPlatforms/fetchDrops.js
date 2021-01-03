const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit) => {
    let drops;

    return foundation.fetchDrops( parseInt(startTime / 1000), limit )
    .then(res => {
        drops = res;
        return nifty.fetchDrops( startTime, limit )
    }).then(res => {
    /*
        drops.push(...res);
        return zora.fetchDrops(startTime, limit)
    })
    .then(res => {
    */
        drops.push(...res);
        return superrare.fetchDrops( startTime, limit );
    }).then(res => {
        drops.push(...res);
        return drops;
    });
}
