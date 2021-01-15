const axios = require('axios');
const dropFormatter = require('./format.drops');
const saleFormatter = require('./format.sales');
const bidFormatter = require('./format.bids');

module.exports = function(startTime, limit = 10) {
    const url = "https://superrare.co/api/v2/nft/get-events";

    return axios.post(url, {
        qty: limit,
        contractAddresses: [
            "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
            "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0"
        ],
        nftEventTypes: [
            "CREATION", "SALE", "AUCTION_ENDED", "AUCTION_BID", 'BID', 'ACCEPT_BID'
        ],
        minBidFilter: true,
        filteredCreatorAddresses: [],
    })
    .then(res => {
        return res.data.result.eventsWithUsers
        .map(item => {
            let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(/\s/g, '-') }-${ item.nonFungibleToken.tokenId }`;
            // let creatorUrl = `https://superrare.co/${ item.creator.username }`
            let buyer, seller, price, transaction = {};
            let payload;

            switch(item.nftEventType) {
                case 'CREATION':
                    payload = dropFormatter(item);
                    break;
                case 'SALE':
                    payload = saleFormatter(item);
                    break;
                case 'BID':
                case 'ACCEPT_BID':
                case 'AUCTION_BID':
                    payload = bidFormatter(item);
                    break;
                default:
                    payload = {}
                    break;
            }

            return payload;
        }).filter(item => {
            return ( new Date(item.date) > startTime );
        });
    });
}
