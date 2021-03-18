module.exports = (item) => {
    let price, transaction = {}, buyer, seller, bidder, previousBidder;

    switch(item.nftEventType) {
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
            if(item.auctionBid.bidder) {
                bidder = {
                    name: item.auctionBid.bidder.username,
                    url: `https://superrare.co/${ item.auctionBid.bidder.username }`
                }
            }

            if(item.auctionBid.previousBidder) {
                previousBidder = {
                    name: item.auctionBid.previousBidder.username
                }
            }
            break;
    }

    return {
        name: item.nonFungibleToken.name,
        ...item.nonFungibleToken.image && {img: item.nonFungibleToken.image},
        transaction,
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
        },
        date: item.timestamp,
        event: 'bid',
        platform: 'superrare',
        ...bidder && {bidder},
        ...previousBidder && {previousBidder},
        ...buyer && {buyer},
        ...seller && {seller}
    }
}
