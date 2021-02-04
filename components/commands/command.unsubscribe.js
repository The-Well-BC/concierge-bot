const subscribedao = require('../daos/subscription.dao');

const unsubscribe = function(messenger, chat_id) {
    return subscribedao.deleteSubscription(chat_id, messenger)
}

module.exports = unsubscribe;
