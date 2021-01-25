const dateFormatter = require('../../utils/dateFormatter');
const bidFormatting = require('./formatting');

module.exports = function(payload, format) {
    let text = '';
    let dDate = payload.date;

    if(payload.closedOn) {
        dDate = new Date(payload.closedOn);
    }

    let { date, time } = dateFormatter(dDate);

    let {nft, buyer, seller, txUrl, extras, bidder} = bidFormatting(payload, format);

    let txPrice;

    if(payload.transaction && payload.transaction.price)
        txPrice = payload.transaction.price;

    if(!extras) extras = [];

    switch(payload.event) {
        case 'listing':
            text = `${nft} was put up for sale`;
            if(transactionPrice)
                text = ` at a price of *${ transactionPrice }*`;
            text += `.\n`;

            break;
        case 'offer':
            if(buyer)
                text += `${ buyer } is offering`;
            else
                text += 'An unnamed buyer is offering';

            if(txPrice)
                text += ` ${ txPrice} for`;
            else
                text += ' to buy';

            text += ` ${nft}`;
            if(txUrl)
                extras.push(`View offer - ${ txUrl }`);

            break;

        case 'bid':
            if(bidder) {
                text += `${ bidder }`;
                if(txPrice)
                    text += ` has bid ${ txPrice } on`;
                else
                    text += ` made a bid for`;
                text += ` ${ nft }`;

            } else {
                text += `A bid`;
                if(txPrice)
                    text += ` of ${ txPrice }`;
                text += ` was made on ${ nft }`;
            }


            break;

    }

    if(extras && extras.length > 0) {
        text += '\n\nMORE:\n';

        extras.forEach(o => text += `\n${o}`);
    }

    return text;
}

