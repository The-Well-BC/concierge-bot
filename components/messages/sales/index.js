const dateFormatter = require('../../utils/dateFormatter');
const plain = require('./format.plain');
const markdown = require('./format.markdown');
const markdownV2 = require('./format.markdownV2');

const ethConverter = require('../../ethPrice');

module.exports = function(payload, format) {
    let textParts;
    let { date, time } = dateFormatter(payload.date);
    let dateStr = `${ date } (${time})`, price, txPrice;

    if(payload.transaction && payload.transaction.price) {
        let prices = ethConverter.getPrices();
        txPrice = payload.transaction.price;

        let tokensRegex = new RegExp( Object.keys(prices).join('|'), 'ig' );
        // let token = txPrice.match(/(?<=\d+)\s?[a-zA-Z]+$/);
        let token = txPrice.match(tokensRegex);

        if(token != null) {
            console.log('TOKEN', token);

            token = token[0].trim().toLowerCase();

            if(token) {
                if(prices[token]) {
                    let divider =  prices[token];
                    console.log('DIVIDER', divider);
                    let tokenRegex = new RegExp(token, 'i');
                    number = txPrice.replace(tokenRegex, '');

                    number = number / divider;

                    number = number.toFixed(2)

                    console.log('NUMBER', number);

                    number = new Intl.NumberFormat().format(number);

                    txPrice += ` ($${number})`;
                }
            }
        }
    }

    switch(format) {
        case 'plain':
            textParts = plain(payload, format)
            break;
        case 'markdown':
            textParts = markdown(payload, format);
            break;
        case 'markdownV2':
        case 'markdownv2':
            textParts = markdownV2(payload, format);
            /*
            if(txPrice)
                txPrice = txPrice.replace(/\./g, '\\.');
            */
            break;
    }

    const { nftName, creator, buyer, more, link } = textParts;

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

    return { text, ...link && {link} };
}
