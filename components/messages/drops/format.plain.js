module.exports = function(payload) {
    let creator = '', product, extras = [];

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
        extras.push(`MORE → ${payload.url}`);

    return { creator, product, extras };
}
