const foundation = require('./foundation');
const zora = require('./zora');
const superrare = require('./superrare');
const nifty = require('./nifty');

module.exports = (limit) => {
    let creators;

    return foundation.fetchCreators(limit )
    .then(res => {
        creators = res;
        return creators;
    });
}
