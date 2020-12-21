let drops = require('./drops');
let purchases = require('./purchases');
const bids = require('./bids');

module.exports = {
    fetchDrops: drops,
    fetchSales: purchases,
    fetchPurchases: purchases,
    fetchBids: bids
}
