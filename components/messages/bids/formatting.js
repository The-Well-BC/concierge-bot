module.exports = function(payload, format) {
    let text = { extras: []};
    let buyer, seller, tx, bidder;

    if(payload.buyer) {
        buyer = payload.buyer;

        if(buyer.name) {
            text.buyer = buyer.name
        }
    } else
        text.buyer = 'An unnamed buyer is offering';

    if(payload.seller) {
        if(payload.seller.name)
            seller = payload.seller;
    }

    if(payload.bidder) {
        bidder = payload.bidder;

        if(bidder.name)
            text.bidder = bidder.name;
    }

    if(payload.transaction) {
        tx = payload.transaction;
    }


    text.nft = payload.name;

    switch(format) {
        case 'plain':
        default:

            if(payload.event === 'bid' && payload.url)
                text.extras.push(`View ${ text.nft } - ${ payload.url}`);

            if(payload.transaction && payload.transaction.url)
                text.extras.push(`View ${ payload.event } - ${ payload.transaction.url }`);
            break;

        case 'markdown':
        case 'markdownv2':
        case 'markdownV2':
            /*
            if(buyer && buyer.name && buyer.url)
                text.buyer = `[${ text.buyer }](${ payload.buyer.url})`;
            */

            if(payload.event === 'bid' && payload.url)
                text.nft = `[${ text.nft }](${ payload.url})`;
            if(payload.transaction && payload.transaction.url)
                text.extras.push(`[View ${ payload.event}](${ payload.transaction.url })`);
            break;
    }

    return text;
}

