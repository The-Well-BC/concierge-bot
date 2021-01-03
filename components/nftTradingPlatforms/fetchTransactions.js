const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime, limit) => {
    let drops;

    return foundation.fetchPurchases( parseInt(startTime / 1000), limit )
    .then(res => {
        drops = res;
        return nifty.fetchPurchases( startTime, limit )
    /*
    }).then(res => {
        drops.push(...res);
        return zora.fetchPurchases(startTime, limit)
    */
    }).then(res => {
        drops.push(...res);
        return superrare.fetchPurchases( startTime, limit );
    }).then(res => {
        drops.push(...res);
        return drops;
    });
}
