module.exports = function(p) {
    const { name, title, slug, featuredImage, organisation, releaseDate, variants } = p;
    const img = (featuredImage) ? featuredImage.mediaURL : null;
    // console.log('PRODUCT', p);
    let creatorURL = `https://store.zora.co/${ organisation.slug }/`;
    let url = creatorURL + slug;

    return {
        name: `${ name } - ${ title }`,
        url,
        creator: {
            name: organisation.name,
            url: creatorURL
        },
        ...img && {img},
        event: 'drop',
        platform: 'zora',
        date: p.date,
        releaseDate
    }
}
