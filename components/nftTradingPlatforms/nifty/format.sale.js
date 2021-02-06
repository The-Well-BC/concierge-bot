module.exports = function(item) {
    let nft = {
        name: item.NiftyObject.name,
        url: `https://niftygateway.com/itemdetail/secondary/${ item.NiftyObject.contractAddress }`,
        img: item.NiftyObject.image_url,
        date: item.Timestamp,
        event: 'sale',
        platform: 'nifty',
        transaction: {
            price: '$' + item.SaleAmountInCents/100
        },
        seller: {
            name: item.SellingUserProfile.name,
            url: `https://niftygateway.com/profile/${ item.SellingUserProfile.profile_url }`
        },
        buyer: {
            name: item.PurchasingUserProfile.name,
            url: `https://niftygateway.com/profile/${ item.PurchasingUserProfile.profile_url }`
        }
    }

    if(item.NiftyObject.tokenId)
        nft.url += '/' + item.NiftyObject.tokenId;

    return nft;
}
