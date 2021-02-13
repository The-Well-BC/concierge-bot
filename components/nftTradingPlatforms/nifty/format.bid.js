module.exports = function(item) {
    let niftyObj = item.NiftyObject || item.UnmintedNiftyObj;
    let nft = {
        name: niftyObj.name || niftyObj.niftyTitle,
        ...niftyObj.niftyImageURL && {img: niftyObj.niftyImageURL},
        date: item.Timestamp,
        event: 'bid',
        platform: 'nifty',
    }

    if(item.ListingUserProfile) {
        nft.seller = {
            name: item.ListingUserProfile.name,
            url: `https://niftygateway.com/profile/${ item.ListingUserProfile.profile_url }`
        }
    }

    if(niftyObj.contractObj && niftyObj.contractObj.contractAddress)
        nft.url = `https://niftygateway.com/itemdetail/secondary/${ niftyObj.contractObj.contractAddress }`;

    if(item.Type === 'offer') {
        nft.event = 'offer';
        nft.transaction = {
            price: '$' + item.OfferAmountInCents/100
        };
    } else {
        nft.transaction = {
            price: '$' + item.BidAmountInCents/100
        }
    }

    return nft;
}
