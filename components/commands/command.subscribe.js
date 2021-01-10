const subscribedao = require('../daos/subscription.dao');
const platformNames = require('../nftTradingPlatforms/platformNames');
const botMessages = require('../botMessages');

const subscribe = function(services, messenger, chat_id) {
    if(!services) services = 'all';

    if(services == 'all')
        return subscribedao.addSubscription(chat_id, messenger)
    else if ( Array.isArray(services) ) {
        let offItem;
        let goodToGo = services.every(item => {
            if(Object.keys(platformNames).includes(item))
                return true
            else {
                offItem = item;
                return false;
            }
        });

        let filters = { };
        filters.platforms = services;

        if(goodToGo == false) {
            let err = new Error('invalid_platform');
            err.platform = offItem;
            err.messenger = messenger;

            return Promise.reject(err);
        } else
            return subscribedao.addSubscription(chat_id, messenger, filters)
    }
}

module.exports = { subscribe };
