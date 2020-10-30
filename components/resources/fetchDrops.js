const foundation = require('./foundation');
const zora = require('./zora');

module.exports = () => {
    return foundation.fetchDrops()
    .then(res => {
        drops = res;
        return zora.fetchDrops();
    }).then(res => {
        drops.push(...res);
        return drops
    });
}
