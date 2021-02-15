module.exports = function(item) {
    const { url } = item;

    let creator = {
        name: item.nft.creator.name,
        url: item.nft.creator.url
    }

    let bid = item.bids[0];
    item.date = item.timestamp;

    return {
        name: item.nft.name,
        url,
        creator,
        date: bid.date,
        buyer: {
            id: bid.bidder.id
        },
        seller: {
            id: item.seller.id
        },
        platform: 'foundation',
        transaction: {
            price: bid.amountInETH + ' ETH'
        },
        event: 'sale',
    }
}
