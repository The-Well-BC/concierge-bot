module.exports = function(payload, format) {
    let action = 'bought';

    let text = {more:[]};

    let nftName = `"${payload.name}"`;

    text = {...text, nftName};

    if(payload.buyer && payload.buyer.name) {
        text.buyer = payload.buyer.name;
    }

    if(payload.url)
        // text.more.push(`\nView ${ payload.name } - ${ payload.url }`);
        text.link = payload.url;

    if(payload.creator) {
        if(payload.creator.name) {
            text.creator = payload.creator.name;
        }
    }

    return text;
}
