module.exports = function(p) {
    // console.log('SALE PAYLAOD', p);
    let { date } = p;

    const img = (p.media) ? p.media.contentURI : null;

    let price = p.amount;

    return {
        name: p.media.name,
        img,
        price,
        event: 'sale',
        platform: 'zora',
        date: p.date,
    }
}
