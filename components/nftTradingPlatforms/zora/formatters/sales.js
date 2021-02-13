module.exports = function(p) {
    const { name, title, featuredImage, organisation, releaseDate, variants } = p;
    const img = (featuredImage) ? featuredImage.mediaURL : null;
    // console.log('PRODUCT', p);
    let price = p.latestPrice / 1000000;
    price = '$' + parseFloat(price).toFixed(2);

    return {
        name: `${ name } - ${ title }`,
        creator: organisation.name,
        img,
        price,
        event: 'sale',
        service: 'zora',
        date: p.date,
        releaseDate
    }
}
