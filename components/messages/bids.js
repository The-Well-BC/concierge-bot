const dateFormatter = require('../utils/dateFormatter');

module.exports = function(payload) {
    let text = '';
    let dDate = payload.date;

    if(payload.closedOn) {
        dDate = new Date(payload.closedOn);
    }

    let { date, time } = dateFormatter(dDate);

    let product = payload.name;
    let buyer, seller;
    if(payload.buyer) {
        if(payload.buyer.name)
            buyer = payload.buyer.name;
    }

    if(payload.seller) {
        if(payload.seller.name)
            seller = payload.seller.name;
    }

    switch(payload.event) {
        case 'listing':
            text = `${product} was put up for sale`;
            if(payload.transaction && payload.transaction.price)
                text = ` at a price of *${ payload.transaction.price }*`;
            text = `.\n`;

            break;
        case 'offer':
            text = `${product} was put up for sale`;
            if(payload.transaction && payload.transaction.price)
                text = ` at a price of *${ payload.transaction.price }*`;
            text = `.\n`;

    }

    text += `Date: ${ date } (${ time })`;
    if(payload.creator && payload.creator.url) {
        let cname;
        if(payload.creator.name.slice(-1) == 's')
            text += `\nView ${ payload.creator.name }' other NFTs - ${ payload.creator.url }`;
        else
            text += `\nView ${ payload.creator.name }'s other NFTs - ${ payload.creator.url }`;
    }

    return text;
}

