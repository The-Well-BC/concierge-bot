const extractPriceFromCurrencyString = function(priceString) {
    console.log('PRICE STRING', priceString);
    let number = null;
    // Remove commas
    priceString = priceString.replace(/,/g, '');
    // $123
    if( priceString.match(/^\$\d+$/))
        number = priceString.match(/(?<=\$)\d+$/);

    // $123.5566
    else if( priceString.match(/^\$\d+\.\d+$/) )
        number = priceString.match(/(?<=\$)\d+\.\d+$/);

    // $123,456.23
    else if( priceString.match(/^\$\d+(,\d{3})*(\.\d+)?$/))
        number = priceString.match(/(?<=^\$)\d+(,\d{3})*(\.\d+)?$/);

    if(number && Array.isArray(number))
        number = number[0];

    if(number)
        number = parseFloat(number);

    return { number };
}

module.exports = (item, filter) => {
    let price = null;
    let txPrice = null;

    let passedFilter = true;

    if(item.price)
        price = extractPriceFromCurrencyString(item.price).number; 
    if(item.transaction && item.transaction.price)
        txPrice = extractPriceFromCurrencyString(item.transaction.price).number; 

    // Prices
    let priceFilters = ['priceGT', 'priceGTE', 'priceLT', 'priceLTE',
                        'txPriceGT', 'txPriceGTE', 'txPriceLT', 'txPriceLTE'];
    if( priceFilters.some(key => filter.hasOwnProperty(key)) ) {

        let priceGT = (filter.priceGT) ? extractPriceFromCurrencyString(filter.priceGT).number : null;
        let txPriceGT = (filter.txPriceGT) ? extractPriceFromCurrencyString(filter.txPriceGT).number : null;

        let priceGTE = (filter.priceGTE) ? extractPriceFromCurrencyString(filter.priceGTE).number : null;
        let txPriceGTE = (filter.txPriceGTE) ? extractPriceFromCurrencyString(filter.txPriceGTE).number : null;

        let priceLT = (filter.priceLT) ? extractPriceFromCurrencyString(filter.priceLT).number : null;
        let txPriceLT = (filter.txPriceLT) ? extractPriceFromCurrencyString(filter.txPriceLT).number : null;

        let priceLTE = (filter.priceLTE) ? extractPriceFromCurrencyString(filter.priceLTE).number : null ;
        let txPriceLTE = (filter.txPriceLTE) ? extractPriceFromCurrencyString(filter.txPriceLTE).number : null ;

        if(price) {
            if( priceGT && !(price > priceGT) )
                passedFilter = false;

            if(priceGTE && !(price >= priceGTE) )
                passedFilter = false;

            if(priceLT && !(price < priceLT))
                passedFilter = false;

            if(priceLTE && !(price <= priceLTE) )
                passedFilter = false;
        }

        if(txPrice) {
            if( txPriceGT && !(txPrice > txPriceGT) )
                passedFilter = false;

            if(txPriceGTE && !(txPrice >= txPriceGTE) )
                passedFilter = false;

            if(txPriceLT && !(txPrice < txPriceLT))
                passedFilter = false;

            if(txPriceLTE && !(txPrice <= txPriceLTE) )
                passedFilter = false;
        }
    }

    return passedFilter;
}
