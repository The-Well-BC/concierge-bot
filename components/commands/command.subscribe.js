const subscribedao = require('../daos/subscription.dao');
const platformNames = require('../nftTradingPlatforms/platformNames');

const subscribe = function(params, messenger, chat_id) {
    if(!params) params = 'all';

    let paramsStr = params;

    if(params == 'all')
        return subscribedao.addSubscription(chat_id, messenger)
    else {
        let events = ['sale', 'drop', 'listing'];

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
        eventsRegex = new RegExp('(' + eventsRegex + ')', 'g');
        if(eventsRegex.test(paramsStr)) {
            filter.events = paramsStr.match(eventsRegex);
        }

        // Price

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
