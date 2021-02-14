module.exports = function(p) {
    let { date } = p;

    let buyer = {
        id: p.bidder.id,
        url: p.bidder.url
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
