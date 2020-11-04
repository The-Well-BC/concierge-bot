const foundation = require('./foundation');
const zora = require('./zora');

module.exports = (frequency) => {
    const now = new Date();

    let startTime = (frequency == '10 min') ?  new Date().setMinutes(now.getMinutes() - 10)
            : (frequency == '1 hour') ?  new Date().setHours(now.getHours() - 1)
            : (frequency == '1 day') ? new Date().setHours(now.getHours() - 24)
            : new Date().setMinutes(now.getMinutes() - 10);
    

    return foundation.fetchDrops( parseInt(startTime / 1000) )
    .then(res => {
        drops = res;
        if(frequency == '1 day') {
            return zora.fetchDrops(startTime)
            .then(res => {
                drops.push(...res);
                return drops
            });
        } else
            return drops;
    });
}
