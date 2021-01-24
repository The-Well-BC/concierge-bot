const dateFormatter = require('../utils/dateFormatter');

module.exports = function(payload) {
    let text = '';
    let dDate = payload.date;

    if(payload.closedOn) {
        dDate = new Date(payload.closedOn);
    }

    let { date, time } = dateFormatter(dDate);

    let seller = payload.seller;
    let product = payload.name;

    if(payload.event === 'listing') {
        text = `${product} was put up for sale at a price of *${ payload.price }*.\n`;
    }

    text += `Date: ${ date } (${ time })`;
    if(payload.creator.url) {
        let cname;
        if(payload.creator.name.slice(-1) == 's')
            text += `\nView ${ payload.creator.name }' other NFTs - ${ payload.creator.url }`;
        else
            text += `\nView ${ payload.creator.name }'s other NFTs - ${ payload.creator.url }`;
    }

    return text;
}

