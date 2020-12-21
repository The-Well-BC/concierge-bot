const axios = require('axios');
const fetchNftDetails = require('./fetchnftDetails');

module.exports = function() {
    const url = 'https://superrare.co/api/v2/nft/get-by-market-details';

    return axios.post(url, {
        first: 5,
        hasSalePriceWithMarketAddresses: null,
        includeBurned: false,
        orderBy: "TOKEN_ID_DESC",
        ownedByCreator: true,
        auctionHouseContractAddresses: ["0x8c9f364bf7a56ed058fc63ef81c6cf09c833e656"],
        hasBidWithAuctionAddressses: ["0x41a322b28d0ff354040e2cbc676f0320d8c8850d" ,"0x2947f98c42597966a0ec25e92843c09ac17fbaa7"],
        contractAddresses: [
            "0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
            "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0"
        ]
    }, {
        contentType: 'application/json'
    }).catch(e => {
        console.log('ERRRO FETCHING from SuperRare api');
        console.log(e);
        throw e;
    })
    .then(res => {
        res = res.data.result.collectibles;
        /*
        console.log('RESSSSSS RARE', res.data.result);
        return fetchNftDetails(res.data.result.collectibles)
    }).then(res => {
        */
        return res.map(item => {
            let url = `https://superrare.co/artwork-v2/${ item.name.replace(' ', '-') }-${ item.tokenId }`;

            return {
                creator: {
                    name: item.creator.username
                },
                type: 'drop',
                date: item.activityTimestamp,
                img: item.image,
                platform: 'SuperRare',
                url,
                name: item.name
            }
        });
    });
}
