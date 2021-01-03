const subscribedao = require('../daos/subscription.dao');
const platformNames = require('../nftTradingPlatforms/platformNames');
const botMessages = require('../botMessages');

subscribe = function(services, messenger, chat_id) {
    if(services == 'all')
        return subscribedao.addServiceSubscription(chat_id, null, messenger, true)
    else if ( Array.isArray(services) ) {
        let offItem;
        let goodToGo = services.every(item => {
            if( Object.keys(platformNames).includes(item) )
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
        }
        else
            return subscribedao.addServiceSubscription(chat_id, services, messenger, false)
    }
}

module.exports = { subscribe };