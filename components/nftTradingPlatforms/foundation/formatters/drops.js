module.exports = function(payload) {
    const { url, date } = payload;

    let creator = {
        name: payload.creator.name,
        url: payload.creator.url
    }

    return {
        name: payload.name,
        url,
        date,
        platform: 'foundation',
        event: 'drop',
        ...creator && {creator},
        ...(payload.image) && {img: payload.image}
    }
}
