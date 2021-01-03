const axios = require('axios');

module.exports = function(startTime, limit) {
    const url = "https://api.niftygateway.com//market/all-data/";

    return axios.post(url, {
        current: 1,
        size: limit || 30,
        timeout: 30000
    })
    .then(res => {
        let transactions = res.data.data.results.filter(item => item.Type === "sale");
        console.log('RES', res.data.data);

        return transactions.map(item => {
            // console.log('NIFTY ITEM', item);
            return {
                name: item.NiftyObject.name,
                url: `https://niftygateway.com/itemdetail/secondary/${ item.NiftyObject.contractAddress }`,
                img: item.NiftyObject.image_url,
                date: item.Timestamp,
                type: 'sale',
                platform: 'Nifty Gateway',
                transaction: {
                    price: item.SaleAmountInCents/100
                },
                seller: {
                    name: item.SellingUserProfile.name,
                    url: `https://niftygateway.com/profile/${ item.SellingUserProfile.profile_url }`
                },
                creator: {
                    // name: item.metadata.createdBy,
                    // url: `https://niftygateway.com/profile/steezdesign
                },
                buyer: {
                    name: item.PurchasingUserProfile.name,
                    url: `https://niftygateway.com/profile/${ item.PurchasingUserProfile.profile_url }`
                }
            }
        });
    });
}
