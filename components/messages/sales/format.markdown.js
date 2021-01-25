module.exports = function(payload) {
    let text = { extras: []};

    if(payload.buyer && payload.buyer.name) {
        if(payload.buyer.url) 
            text.buyer = `[${ payload.buyer.name }](${ payload.buyer.url })`;
        else
            text.buyer = payload.buyer.name;

    } else 
        text.buyer = 'an anonymous user';

    text.nftName = (payload.url) ? `[${ payload.name }](${ payload.url })` : payload.name;


    if(payload.creator) {
        if(payload.creator.url && payload.creator.name) {
            text.creator = `[${payload.creator.name}](${payload.creator.url})`;
            if(payload.creator.name.slice(-1) == 's')
                text.extras.push(`\n[View ${ payload.creator.name }' other creations](${ payload.creator.url })`);
            else
                text.extras.push(`\n[View ${ payload.creator.name }'s other creations](${ payload.creator.url })`);
        } else if (payload.creator.name)
            text.creator = payload.creator.name;
    }

    return text;
}
