const axios = require('axios');

module.exports = function() {
    const url = "https://api.niftygateway.com//market/all-data/";

    return axios.post(url, {
        current: 1,
        size: 30,
        timeout: 30000
    })
    .then(res => {
        let transactions = res.data.data.results.filter(item => item.Type === "sale");

        return transactions.map(item => {
            console.log('ITEM', item);
            if(item.Type === 'sale') {
                return {
                    name: item.NiftyObject.name,
                    price: item.SaleAmountInCents/100,
                    img: item.NiftyObject.image_url,
                    action: item.Type,
                    date: item.Timestamp,
                    service: 'nifty',
                    buyer: {
                        name: item.PurchasingUserProfile.name,
                        profileUrl: `https://niftygateway.com/profile/${ item.PurchasingUserProfile.profile_url }`
                    }
                }
            }
        });
    });
}
