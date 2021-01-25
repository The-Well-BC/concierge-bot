module.exports = (item) => {
    let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(/\s/g, '-') }-${ item.nonFungibleToken.tokenId }`;

    let price, transaction = {}, buyer, seller, bidder;

    switch(item.nftEventType) {
        case 'ACCEPT_BID':
            transaction.price = item.acceptBid.amount / 1000000000000000000;
            transaction.price = transaction.price + ' ETH';

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
            break;
        case 'BID':
            if(item.bid.bidder && item.bid.bidder.username) {
                bidder = {
                    name: item.bid.bidder.username,
                    url: `https://superrare.co/${ item.bid.bidder.username }`
                }
            } else
                bidder = {name: 'An anonymous user'};
            break;
        case 'AUCTION_BID':
            bidder = {
                name: item.auctionBid.bidder.username,
                url: `https://superrare.co/${ item.auctionBid.bidder.username }`
            }
            break;
    }

    return {
        name: item.nonFungibleToken.name,
        img: item.nonFungibleToken.image,
        transaction,
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
        },
        date: item.timestamp,
        event: 'bid',
        platform: 'superrare',
        url,
        ...bidder && {bidder},
        ...buyer && {buyer},
        ...seller && {seller}
    }
}