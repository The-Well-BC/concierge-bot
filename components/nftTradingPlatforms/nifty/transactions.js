const axios = require('axios');
const formatSale = require('./format.sale');
const formatBid = require('./format.bid');
const formatListing = require('./format.listing');

module.exports = function(startTime, limit) {
    const url = "https://api.niftygateway.com//market/all-data/";

    return axios.post(url, {
        current: 1,
        size: limit || 30,
        timeout: 30000
    })
    .then(res => {
        return res.data.data.results.map(item => {
            let nft;
            switch(item.Type) {
                case 'sale':
                    nft = formatSale(item);
                    break;
                case 'listing':
                    nft = formatListing(item);
                    break;
                case 'offer':
                    nft = formatBid(item);
                    break;
                case 'bid':
                    nft = formatBid(item);
                    break;
                default:
                    nft = {platform: 'nifty'}
                    break;
            }

            return nft;
        });
    });
}
