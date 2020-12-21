const axios = require('axios');

module.exports = function() {
    const url = "https://superrare.co/api/v2/nft/get-by-market-details";

    return axios.post(url, {
        contractAddresses: ["0x41a322b28d0ff354040e2cbc676f0320d8c8850d",
          "0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0"
        ],
        first: 30,
        includeBurned:false,
        orderBy: "RECENT_NFT_EVENT_BY_TOKEN_CONTRACT_ADDRESS_AND_TOKEN_ID__TIMESTAMP_DESC"
    })
    .then(res => {
        return res.data.result.collectibles.map(item => {
            console.log('ITEM', item);
            console.log('ITEM', item.action);
            if(item.action === 'sale') {
                return {
                    ...item
                }
            }
        });
    });
}
