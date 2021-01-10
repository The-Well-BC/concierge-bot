const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (limit) => {
    let drops;

    return foundation.fetchDrops(limit)
    .catch(e => {
        console.error(e);
        return [];
    })
    .then(res => {
        drops = res;
        return superrare.fetchDrops(limit)
        .catch(e => {
            console.error(e);
            return [];
        })
    }).then(res => {
        drops = res;
        return nifty.fetchDrops(limit)
        .catch(e => {
            console.error(e);
            return [];
        })
    }).then(res => {
        drops = res;
        return drops;
    });
}
