module.exports = function(payload) {
    let drops = marketAction.map( item => {
        let type = (item.nft) ? 'nft' : 'xyk';

        const showcase = item.nft || item.market;
        if(item.market) {
            showcase.price = showcase.totalBuyPrice
        } else {
            showcase.price = showcase.minBidNow
        }

        const brand = item.brand;
        item.date = item.timestamp;

        return {
            price: '$' + (showcase.price / 1000000000000000000).toFixed(2),
            name: showcase.name,
            date: new Date(item.date * 1000),
            service: 'foundation',
            brand: brand.name,
            action: item.actionType,
            img: null
        }
    });

    let bidDrops = nftMarketBids.map( bidItem => {
        let type = 'nft';

        const nft = bidItem.nft;

        const brand = bidItem.nft.brand;
        bidItem.date = bidItem.timestamp;

        return {
            price: '$' + nft.minBidPrice,
            minBid: '$' + bidItem.value,
            name: nft.name,
            date: new Date(bidItem.placedOn * 1000),
            service: 'foundation',
            brand: brand.name,
            status: bidItem.status,
            action: bidItem.actionType,
            img: nft.image
        }
    });

    drops.push(...bidDrops);

    return drops;
}
