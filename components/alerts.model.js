const nftFn = require('./nftTradingPlatforms');
const subdao = require('./daos/subscription.dao');
const subscriptionFilter = require('./subscriptionFilter');

const telegram = require('./messenger/telegram');
const twitter = require('./messenger/twitter');

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
            let sortedMessages = {};

            sortedMessages.telegram = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'telegram'));
            sortedMessages.twitter = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'twitter'));

            let telegramTextPayload = sortedMessages.telegram.map(p =>  {
                return { message: telegram.formatter.alertMessage(p.payload), chatIDs: p.chatIDs }
            });

            let twitterTextPayload = sortedMessages.twitter.map(p =>  {
                return { message: twitter.formatter.alertMessage(p.payload), chatIDs: p.chatIDs }
            });

            let messages = telegramTextPayload.map(p => telegram.sendMessage(p.message, p.chatIDs));
            messages.push(
                ...twitterTextPayload.map(p => twitter.sendMessage(p.message, p.chatIDs))
            );

            return Promise.all(messages);
        });
    }
}
