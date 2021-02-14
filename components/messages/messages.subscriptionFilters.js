let nftPlatforms = require('../nftTradingPlatforms/platformNames');

module.exports = (filter) => {
    let text = '';

    if(typeof filter === 'object' && filter != null) {

        let { events, platforms, creators,
            priceGT, priceLT, priceGTE, priceLTE,
            txPriceGT, txPriceLT, txPriceGTE, txPriceLTE
        } = filter;

        let currencyRegex = /(\d)(?=(\d{3})+(?!\d))(?!=\,)/;

        if(events) {
            events = events.map(i => {
                if(i.substring(i.length - 1) !== 's')
                    i += 's';

                return i;
            });

            if(events.length > 1)
                events[events.length - 1] = 'and ' + events[events.length - 1];
            text += `All ${ events.join(', ') }`;
            if(creators)
                text += 'for ';
        } else if(!creators) {
            text += 'Events ';
        }

        if(creators) {
            text += `NFTs created by ${ filter.creators.join(', ') }`;
        }

        let txPrice = false;
        if(txPriceGT || txPriceGTE || txPriceLT || txPriceLTE) {
            txPrice = true;
            if(creators)
                text += ', ';

            if(events)
                text += ' '
            else text += 'for transactions ';

            if(txPriceGT) 
                text += 'over ' + txPriceGT.replace(currencyRegex, '$1,');
            if(txPriceGTE)
                text += 'of '+ txPriceGTE.replace(currencyRegex, '$1,') + ' and above';
            if(txPriceLT)
                text += 'under ' + txPriceLT.replace(currencyRegex, '$1,');
            if(txPriceLTE)
                text += 'of '+ txPriceLTE.replace(currencyRegex, '$1,') + ' and under';
        }

        if(priceGT || priceGTE || priceLT || priceLTE) {
            if(events || creators || txPrice)
                text += ', ';

            text += 'for items that are worth ';

            if(priceGT) 
                text += 'more than ' + priceGT.replace(currencyRegex, '$1,');
            if(priceGTE)
                text += priceGTE.replace(currencyRegex, '$1,') + ' or more';
            if(priceLT)
                text += 'less than ' + priceLT.replace(currencyRegex, '$1,');
            if(priceLTE)
                text += priceLTE.replace(currencyRegex, '$1,') + ' or less';
        }


        if( Array.isArray(platforms)) {
            text += ' on ';

            let platformStr = platforms.map(p => nftPlatforms[p].name);
            if(platformStr.length > 1 ) {
                let last = platformStr[platformStr.length - 1];
                platformStr[platformStr.length - 1] = 'and ' + last;
            }

            platformStr = platformStr.join(', ');

            text += platformStr;
        }
    }

    return text;
}
