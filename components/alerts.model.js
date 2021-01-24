const nftFn = require('./nftTradingPlatforms');
const subdao = require('./daos/subscription.dao');
const subscriptionFilter = require('./subscriptionFilter');

const telegram = require('./messenger/telegram');
const twitter = require('./messenger/twitter');

module.exports = {
    //sendAlerts: function(messages, interval) {
    sendAlerts: function(interval, limit = 10) {
        let payload = [];
        const nfts = nftFn(interval);
        return nfts.fetchEvents(limit)
        .then(res => {
            payload.push(...res);

            return subdao.fetchSubscription()
        })
        .then(subscriptions => {
            // Telegram messages
            let sortedMessages = {};

            subscriptions.push({ chatID: 'all', messenger: 'twitter' });
            sortedMessages.telegram = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'telegram'));
            sortedMessages.twitter = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'twitter'));

            let telegramAlerts = sortedMessages.telegram.map(p =>  {
                return { message: telegram.formatter.alertMessage(p.payload), chatIDs: p.chatIDs }
            });

            let twitterAlerts = sortedMessages.twitter.map(p =>  {
                return { message: twitter.formatter.alertMessage(p.payload), chatIDs: p.chatIDs }
            });

            let messages = telegramAlerts.map(p => telegram.sendMessage(p.message, p.chatIDs));
            messages.push(
                ...twitterAlerts.map(p => twitter.sendMessage(p.message, p.chatIDs))
            );

            return Promise.all(messages);
        });
    }
}
