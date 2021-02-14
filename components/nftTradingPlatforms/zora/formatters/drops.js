module.exports = function(p) {
    const { id, name, title, slug, featuredImage, creator, variants } = p;
    const img = (featuredImage) ? featuredImage.mediaURL : null;
    // console.log('PRODUCT', p);
    let creatorURL = `https://store.zora.co/${ creator.id }/`;
    let url = creatorURL + id;

    return {
        name: `${ name } - ${ title }`,
        url,
        ...creator.name && {creator: {
            name: creator.name,
            url: creatorURL
        }},
        ...img && {img},
        event: 'drop',
        platform: 'zora',
        date: p.date,
    }
}
