module.exports = function(p) {
    let { date } = p;

    let creator = p.media;

    if(creator.creator.id)
        creator.id = creator.creator.id;

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
        ...creator.id && {creator: {
            name: creator.name,
            wallet: {
                address: creator.id
            }
        }},
        buyer,
        transaction: {price},
        event: 'sale',
        platform: 'zora',
        date: p.date,
    }
}
