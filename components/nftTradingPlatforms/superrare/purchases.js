const axios = require('axios');

module.exports = function(startTime, limit) {
    const url = "https://superrare.co/api/v2/nft/get-events";

    return axios.post(url, {
        qty: limit,
        contractAddresses: [
            "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
            "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0"
        ],
        nftEventTypes: [
            'SALE', 'ACCEPT_BID'
        ],
        minBidFilter: true,
        filteredCreatorAddresses: [],
    })
    .then(res => {
        return res.data.result.eventsWithUsers
        .map(item => {
            console.log('RARE ITEM', item);
            let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(' ', '-') }-${ item.nonFungibleToken.tokenId }`;
            // let creatorUrl = `https://superrare.co/${ item.creator.username }`
            let buyer, seller, price;

            if(item.nftEventType === 'SALE') {
                buyer = {
                    name: item.sale.buyer.username,
                    url: `https://superrare.co/${ item.sale.buyer.username }`,
                }

                price = item.sale.amount;

                seller = {
                    name: item.sale.seller.username,
                    url: `https://superrare.co/${ item.sale.seller.username }`
                }
            } else if(item.nftEventType === 'ACCEPT_BID') {
                price = item.acceptBid.amount;
                if(item.acceptBid.bidder) {
                    buyer = {
                        name: item.acceptBid.bidder.username,
                        url: `https://superrare.co/${ item.acceptBid.bidder.username }`,
                    }
                }

                seller = {
                    name: item.acceptBid.seller.username,
                    url: `https://superrare.co/${ item.acceptBid.seller.username }`
                }
            }

            return {
                name: item.nonFungibleToken.name,
                img: item.nonFungibleToken.image,
                price,
                creator: {
                    name: item.nonFungibleToken.metadata.createdBy,
                },
                date: item.timestamp,
                type: 'sale',
                platform: 'SuperRare',
                url,
                /*
                tokensLeft,
                transaction,
                */
                ...buyer && {buyer},
                seller
            }
        }).filter(item => {
            return ( new Date(item.date) > startTime );
        });
    });
}
