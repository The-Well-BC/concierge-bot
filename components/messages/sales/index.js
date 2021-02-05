const dateFormatter = require('../../utils/dateFormatter');
const plain = require('./format.plain');
const markdown = require('./format.markdown');
const markdownV2 = require('./format.markdownV2');

module.exports = function(payload, format) {
    let textParts;
    let { date, time } = dateFormatter(payload.date);
    let dateStr = `${ date } (${time})`, price, txPrice;

    if(payload.transaction && payload.transaction.price)
        txPrice = payload.transaction.price;

    switch(format) {
        case 'plain':
            textParts = plain(payload, format)
            break;
        case 'markdown':
        case 'markdownV2':
        case 'markdownv2':
            textParts = markdown(payload, format);
            break;
    }

    const { nftName, creator, buyer, more } = textParts;

    let text = '⚡ NEW SALE\n'
    text += nftName;
    if(creator)
        text += ` by ${ creator }`;

    text += ` sold to ${ buyer }`;

    if(txPrice)
        text += ` for ${ txPrice }`

    if(more && Array.isArray(more) && more.length > 0) {
        text += `\n`;
        more.forEach(i => text += `\n${ i }`);
    }

    return text;
}
