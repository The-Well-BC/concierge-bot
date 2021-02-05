module.exports = function(payload) {
    let creator = '';

    if(payload.creator.name) {
        creator = `${ payload.creator.name }`;

        if(payload.creator.url)
            creator = `[${ payload.creator.name }](${ payload.creator.url })`;
    }

    let product = `[${ payload.name }](${ payload.url })`;

    return { creator, product };
}
