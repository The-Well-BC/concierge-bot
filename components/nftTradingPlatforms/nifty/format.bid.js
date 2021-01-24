module.exports = function(item) {
    let niftyObj = item.NiftyObject || item.UnmintedNiftyObj;
    let nft = {
        name: niftyObj.name || niftyObj.niftyTitle,
        url: `https://niftygateway.com/itemdetail/secondary/${ niftyObj.contractObj.contractAddress }`,
        img: niftyObj.niftyImageURL,
        date: item.Timestamp,
        event: 'bid',
        platform: 'nifty',
        transaction: {
            price: '$' + item.SaleAmountInCents/100
        },
        seller: {
            name: item.ListingUserProfile.name,
            url: `https://niftygateway.com/profile/${ item.ListingUserProfile.profile_url }`
        }
    }

    if(item.Type === 'offer') {
        nft.event = 'offer';
    }

    return nft;
}
