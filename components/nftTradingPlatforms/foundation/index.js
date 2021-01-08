let drops = require('./drops');
let purchases = require('./purchases');
const bids = require('./bids');
const creators = require('./creators');

module.exports = {
    fetchDrops: drops,
    fetchSales: purchases,
    fetchCreators: creators,
    fetchPurchases: purchases,
    fetchBids: bids
}
