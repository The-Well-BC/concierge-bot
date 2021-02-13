module.exports = function(item) {
    let type = (item.nft) ? 'nft' : 'xyk';

    let tokensLeft = null;

    const showcase = item.nft || item.market;
    if(item.market) {
        showcase.price = showcase.totalBuyPrice
        tokensLeft = item.market.totalSupply;
    } else if(item.nft) {
        showcase.price = showcase.minBidPrice
    }

    const brand = item.brand;
    item.date = item.timestamp;

    let { tokenAmount } = item;

    if(tokenAmount >= 1000000000000000000)
        tokenAmount = tokenAmount / 1000000000000000000;

    // console.log('SALE ITEM', item);
    return {
        date: new Date(item.date * 1000),
        name: showcase.name,
        price: '$' + (showcase.price / 1000000000000000000).toFixed(2),
        buyer: {
            walletUri: `https://blockscout.com/poa/xdai/address/${ item.gateway }/transactions`,
        },
        seller: {
        },
        creator: {
            name: `${brand.name} (${brand.symbol})`
        },
        platform: 'foundation',
        ...tokensLeft && { tokensLeft },
        transaction: {
            url: `https://blockscout.com/poa/xdai/tx/${ item.transactionHash }/token-transfers`,
            tokens: tokenAmount
        },
        event: 'sale',
        url: `https://foundation.app/${ brand.symbol.toLowerCase() }`
    }
}
