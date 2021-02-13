module.exports = function(payload) {
    const creator = payload.brand;
    let date = new Date(payload.goLiveDate * 1000);

    const url = (payload.symbol) ?  `https://foundation.app/${ payload.brand.symbol }/$${ payload.symbol }`
        : `https://foundation.app/${ payload.brand.symbol }/${ payload.name.replace(/\s/g, '-') }-${ payload.tokenId }`;

    return {
        name: payload.name,
        url,
        date,
        platform: 'foundation',
        event: 'drop',
        creator,
        ...(payload.image) && {img: payload.image}
    }
}
