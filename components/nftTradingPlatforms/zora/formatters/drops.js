module.exports = function(p) {
    const { id, name, title, slug, creator, variants } = p;
    let url = creator.url + '/' + id;

    return {
        name,
        url,
        ...creator.id && {creator: {
            name: creator.name,
            url: creator.url,
            wallet: {
                address: creator.id
            }
        }},
        event: 'drop',
        platform: 'zora',
        date: p.date,
    }
}
