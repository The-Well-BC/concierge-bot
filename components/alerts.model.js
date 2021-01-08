const nftFn = require('./nftTradingPlatforms');
const subdao = require('./daos/subscription.dao');
const telegram = require('./messenger/telegram');
const subscriptionFilter = require('./subscriptionFilter');

module.exports = {
    //sendAlerts: function(messages, interval) {
    sendAlerts: function(interval, limit) {
        let payload = [];
        const nfts = nftFn(interval);
        return nfts.fetchDrops(limit)
        .then(tradingDrops => {
            payload = tradingDrops;
            return nfts.fetchPurchases(limit)
        }).then(res => {
            payload.push(...res);

            return subdao.fetchSubscription()
        })
        .then(subscriptions => {
            // Telegram messages
            let sortedMessages = subscriptionFilter(payload, subscriptions);
            let textPayload = sortedMessages.map(p =>  {
                return { message: telegram.formatter.alertMessage(p.payload), chatIDs: p.chatIDs }
            });

            let messages = textPayload.map(p => telegram.sendMessage(p.message, p.chatIDs));
            return Promise.all(messages);
        });
    }
}
