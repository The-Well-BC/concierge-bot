const nftFn = require('./nftTradingPlatforms');
const subdao = require('./daos/subscription.dao');
const telegram = require('./messenger/telegram');

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

            return subdao.fetchServiceSubscription()
        })
        .then(res => {
            console.log('PAYLODA', payload);
            let chatIDs = res.map(item => item.chat_id);
            let textPayload = payload.map(p => telegram.formatter.alertMessage(p));
            console.log('TEXT PAYLO9AD', textPayload);
            let messages = textPayload.map(p => telegram.sendMessage(p, chatIDs));
            return Promise.all(messages);
        });
    }
}
