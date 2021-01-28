module.exports = (item) => {
    let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(/\s/g, '-') }-${ item.nonFungibleToken.tokenId }`;
    let price, transaction = {};

    let buyer = { };

    if(item.sale.buyer) {
        buyer = {
            name: item.sale.buyer.username,
            url: `https://superrare.co/${ item.sale.buyer.username }`,
        }
    /*
    } else if (item.sale.buyerAddress) {
        buyer.url = 
    */
    }

    transaction.price = item.sale.amount;

    let seller = {
        name: item.sale.seller.username,
        url: `https://superrare.co/${ item.sale.seller.username }`
    }

    if(transaction.price) {
        transaction.price = parseInt(transaction.price) / (10**18);
        transaction.price = transaction.price + ' ETH';
    }

    return {
        name: item.nonFungibleToken.name,
        img: item.nonFungibleToken.image,
        transaction,
        creator: {
            name: item.nonFungibleToken.metadata.createdBy,
        },
        date: item.timestamp,
        event: 'sale',
        platform: 'superrare',
        url,
        /*
        tokensLeft,
        transaction,
        */
        ...buyer && {buyer},
        seller
    }
}
