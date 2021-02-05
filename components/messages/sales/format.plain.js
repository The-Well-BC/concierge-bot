module.exports = function(payload, format) {
    let action = 'bought';

    let text = {nftName: payload.name, more:[]};

    if(payload.buyer && payload.buyer.name) {
        text.buyer = payload.buyer.name;
    } else
        text.buyer = 'an anonymous user';

    if(payload.url)
        // text.more.push(`\nView ${ payload.name } - ${ payload.url }`);
        text.more.push(`MORE →  ${ payload.url }`);

    if(payload.creator) {
        if(payload.creator.name) {
            text.creator = payload.creator.name;
        }
    }

    return text;
}
