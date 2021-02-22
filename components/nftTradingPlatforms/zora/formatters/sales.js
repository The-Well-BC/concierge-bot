module.exports = function(p) {
    console.log('SALE PAYLOAD\n', p);

    let { date } = p;

    let buyer = {
        id: p.bidder.id,
        url: p.bidder.url,
        wallet: {
            address: p.bidder.id
        }
    }

    if(p.bidder.name)
        buyer.name =  p.bidder.name;

    const img = (p.media) ? p.media.contentURI : null;

    let price = p.amount;

    return {
        name: p.media.name,
        img,
        buyer,
        transaction: {price},
        event: 'sale',
        platform: 'zora',
        date: p.date,
    }
}
