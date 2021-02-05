const nftFn = require('./nftTradingPlatforms');
const subdao = require('./daos/subscription.dao');
const subscriptionFilter = require('./subscriptionFilter');

const telegram = require('./messenger/telegram');
const twitter = require('./messenger/twitter');

const messages = require('./messages');

module.exports = {
    //sendAlerts: function(messages, interval) {
    sendAlerts: function(interval, limit = 10) {
        let payload = [];
        const nfts = nftFn(interval);
        return nfts.fetchEvents(limit)
        .then(res => {
            // Temporary: sending texts for only sales and drops
            res = res.filter(i => ['sale', 'drop'].includes(i.event));

            payload.push(...res);

            return subdao.fetchSubscription()
        })
        .then(subscriptions => {
            // Telegram messages
            let sortedMessages = {};

            subscriptions.push({ chatID: 'all', messenger: 'twitter' });

            sortedMessages.twitter = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'twitter'));
            sortedMessages.telegram = subscriptionFilter(payload, subscriptions.filter(i => i.messenger === 'telegram'));

            let telegramAlerts = sortedMessages.telegram.map(p =>  {
                return { message: messages.alertMessage(p.payload, telegram.format), chatIDs: p.chatIDs }
            });

            let twitterAlerts = sortedMessages.twitter.map(p =>  {
                return { message: messages.alertMessage(p.payload, twitter.format), chatIDs: p.chatIDs }
            });

            let promises = telegramAlerts.map(p => telegram.sendMessage(p.message, p.chatIDs));
            promises.push(
                ...twitterAlerts.map(p => twitter.sendMessage(p.message, p.chatIDs))
            );

            return Promise.all(promises);
        });
    }
}
