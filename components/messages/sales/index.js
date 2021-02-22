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

        if(/^\$/.test(txPrice) && !txPrice.includes(',')) {
            let number = txPrice.match(/(?<=\$)\d+\.?\d+$/)[0];

            number = new Intl.NumberFormat().format(number);

            txPrice = `$${number}`;
        } else {

            let tokensRegex = new RegExp( Object.keys(prices).join('|'), 'ig' );
            // let token = txPrice.match(/(?<=\d+)\s?[a-zA-Z]+$/);
            let token = txPrice.match(tokensRegex);

            if(token != null) {
                token = token[0].trim().toLowerCase();

                if(token) {
                    if(prices[token]) {
                        let divider =  prices[token];
                        let tokenRegex = new RegExp(token, 'i');
                        number = txPrice.replace(tokenRegex, '');

                        number = number / divider;

                        number = number.toFixed(2)

                        number = new Intl.NumberFormat().format(number);

                        txPrice += ` ($${number})`;
                    }
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

    text += ` sold to `;

    if(buyer) {
        text += buyer;
    } else if(payload.buyer) {
        if(payload.buyer.wallet && payload.buyer.wallet.address) {
            let addr = payload.buyer.wallet.address

            text += addr.substring(0,5) + '...' + addr.slice(-3);
        }
    } else {
        text += 'an anonymous user';
    }

    if(txPrice)
        text += ` for ${ txPrice }`

    if(more && Array.isArray(more) && more.length > 0) {
        text += `\n`;
        more.forEach(i => text += `\n${ i }`);
    }

    return { text, ...link && {link} };
}
