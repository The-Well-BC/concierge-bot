module.exports = function(payload) {
    let creator = '', product;

    if(payload.creator) {
        if(payload.creator.name) {
            creator = payload.creator.name;
        }

        /*
        if(payload.creator.url)
            extras.push( `${ payload.creator.url }`;
        */
    }

    product = payload.name;

    if(payload.url)
        link = payload.url;

    return { creator, product, ...link && {link} };
}
