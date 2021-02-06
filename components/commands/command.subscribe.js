const subscribedao = require('../daos/subscription.dao');
const platformNames = require('../nftTradingPlatforms/platformNames');

const subscribe = function(params, messenger, chat_id) {
    if(!params) params = 'all';

    let paramsStr = params;

    if(params == 'all')
        return subscribedao.addSubscription(chat_id, messenger)
    else {
        let events = ['sale', 'drop', 'listing', 'bid', 'offer', 'offering'];

        for(key in platformNames) {
            const name = platformNames[key].name;

            const nameRegex = new RegExp(name, 'ig');

            if(nameRegex.test(params)) {
                paramsStr = params.replace(nameRegex, key);
            }
        }

        let reservedWords = ['creator', 'price', 'events', 'price', ...Object.keys(platformNames), events.join('s?|') + 's?'];
        let platformsRegex = Object.keys(platformNames).join('|');

        let priceGT, transactionPriceGT;

        let filter = { };

        // Events
        let eventsRegex = events.join('|');
        eventsRegex = new RegExp('(' + eventsRegex + ')', 'ig');

        paramsStr = paramsStr.replace(/sells\b/, 'sale');

        if(eventsRegex.test(paramsStr)) {
            filter.events = paramsStr.match(eventsRegex).map(i => i.toLowerCase());
        }

        // Price
        //Check forsignsof money first
        if(/(\$\d+|\d\s?eth)/i.test(paramsStr)) {
            paramsStr.split(/\,(?!\s?\d)/).forEach(str => {
                let moneyedString = str.replace(/(?<=\d)\,(?=\d)/g, '');
                moneyedString = moneyedString.replace(/(?<=\d)\s*eth/i, ' ETH');

                let nftPriceKeywords = /(?<=items?|tokens?|nfts?)\s((is\s|are\s)?worth|is)/i;
                let txPriceKeywords = /(bids?|sells?|sales?|transactions?|listings?|offerings?|offers?)\b/ig;
                let moneyRegex = String.raw`\s\$?\d+\.?\d+\s?(eth)?`

                let gtRegex = new RegExp('(?<=greater than|over|more than)' + moneyRegex, 'ig');
                let ltRegex = new RegExp('(?<=less than|below|under)' + moneyRegex, 'ig');
                let gteRegex = new RegExp(String.raw`((?<=greater than or equal to|more than or equal to|atleast|at least|a minimum of)` + moneyRegex +  '|' + moneyRegex + String.raw`\s*(?=min|or more))`, 'ig');

                let lteRegex = new RegExp(String.raw`((?<=less than or equal to|at most)` + moneyRegex +   '|'   + moneyRegex + String.raw`\s+(?=or less|max|and under|and below))`, 'ig');

                if(nftPriceKeywords.test(moneyedString)) {
                    if(gtRegex.test(moneyedString))
                        filter.priceGT = moneyedString.match(gtRegex)[0].trim();
                    if(gteRegex.test(moneyedString))
                        filter.priceGTE = moneyedString.match(gteRegex)[0].trim();
                    if(ltRegex.test(moneyedString))
                        filter.priceLT = moneyedString.match(ltRegex)[0].trim();
                    if(lteRegex.test(moneyedString))
                        filter.priceLTE = moneyedString.match(lteRegex)[0].trim();

                } else if (txPriceKeywords.test(moneyedString)) {
                    if(gtRegex.test(moneyedString))
                        filter.txPriceGT = moneyedString.match(gtRegex)[0].trim();
                    if(gteRegex.test(moneyedString))
                        filter.txPriceGTE = moneyedString.match(gteRegex)[0].trim();
                    if(ltRegex.test(moneyedString))
                        filter.txPriceLT = moneyedString.match(ltRegex)[0].trim();
                    if(lteRegex.test(moneyedString))
                        filter.txPriceLTE = moneyedString.match(lteRegex)[0].trim();

                } else {
                    console.log('\nNothing to see here\n************************\nSTRING:', moneyedString);

                }
            });
        }

        // Creators
        if(/creators?/.test(paramsStr)) {
            let regexStr = new RegExp('creator.*?(?=' + reservedWords.join('|') + ')');
            let creatorStr = paramsStr.match(regexStr);

            if(creatorStr == null) {
                creatorStr = paramsStr.match(/(?<=creators?\s).*/);
            }

            creatorStr = creatorStr[0];

            filter.creators = creatorStr.split(',').map(i => i.trim());;
        }

        // NFT Platforms
        { 
            const regexStr = new RegExp('(' + platformsRegex + ')', 'ig');
            let platforms = paramsStr.match(regexStr);
            if(platforms) {
                let offItem;
                let goodToGo = platforms.every(item => {
                    if(Object.keys(platformNames).includes(item))
                        return true
                    else {
                        offItem = item;
                        return false;
                    }
                });

                if(goodToGo == false) {
                    let err = new Error('invalid_platform');
                    err.platform = offItem;
                    err.messenger = messenger;

                    return Promise.reject(err);
                } else
                    filter.platforms = platforms;
            }
        }

        return subscribedao.addSubscription(chat_id, messenger, filter)
    }
}

module.exports = { subscribe };
