module.exports = function(item) {
    let nft = {
        name: item.NiftyObject.name,
        url: `https://niftygateway.com/itemdetail/secondary/${ item.NiftyObject.contractAddress }`,
        img: item.NiftyObject.image_url,
        date: item.Timestamp,
        event: 'listing',
        platform: 'nifty',
        transaction: {
            price: '$' + item.SaleAmountInCents/100
        },
        owner: {
            name: item.ListingUserProfile.name,
            url: `https://niftygateway.com/profile/${ item.ListingUserProfile.profile_url }`
        }
    }

    return nft;
}
