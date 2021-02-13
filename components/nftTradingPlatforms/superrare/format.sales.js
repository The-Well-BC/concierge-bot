module.exports = (item) => {
    let url = `https://superrare.co/artwork-v2/${ item.nonFungibleToken.name.replace(/\s/g, '-') }-${ item.nonFungibleToken.tokenId }`;
    let price, transaction = {};

    let buyer = { }, seller = {};

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
        case 'SALE':
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

            seller = {
                name: item.sale.seller.username,
                url: `https://superrare.co/${ item.sale.seller.username }`
            }

            if(transaction.price) {
                transaction.price = parseInt(transaction.price) / (10**18);
                transaction.price = transaction.price + ' ETH';
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
        event: 'sale',
        platform: 'superrare',
        url,
        ...buyer && {buyer},
        seller
    }
}
