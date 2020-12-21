const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (startTime) => {
    let drops;

    return foundation.fetchDrops( parseInt(startTime / 1000) )
    .then(res => {
        drops = res;
        return nifty.fetchDrops( startTime )
        /*
        if(frequency == '1 day') {
            return zora.fetchDrops(startTime)
            .then(res => {
                drops.push(...res);
                return drops
            });
        } else
        */
    }).then(res => {
        drops.push(...res);
        return superrare.fetchDrops( startTime );
    }).then(res => {
        drops.push(...res);
        return drops;
    });
}
