const fetchDrops = require('./resources/fetchDrops');
const subdao = require('./subscription.dao');
const alertHelper = require('./alerts');
const sendMessage = require('./sendMessage');
const sendPhoto = require('./sendPhoto');

module.exports = {
    //sendAlerts: function(messages, interval) {
    sendAlerts: function(interval) {
        return fetchDrops(interval)
        .then(tradingDrops => {
            let counter = 0;
            const fetchSubscriptions = function(max) {
                if(counter == tradingDrops.length)
                    return
                return subdao.fetchServiceItemSubs({ service: tradingDrops[counter].service, item: tradingDrops[counter].name })
                .then(res => {
                    let messages = alertHelper.alertMessage(res, tradingDrops[counter]);

                    let alertsSent = 0;
                    let sendEachAlert = function() {
                        if( alertsSent === messages.length)
                            return new Promise(resolve => resolve(true));
                        else {
                            if(messages[alertsSent].photo) {
                                return sendPhoto(messages[alertsSent])
                                .then(res => {
                                    alertsSent++;
                                    return sendEachAlert();
                                });
                            }
                            else {
                                return sendMessage(messages[alertsSent])
                                .then(res => {
                                    alertsSent++;
                                    return sendEachAlert();
                                });
                            }
                        }
                    }

                    counter++;
                    return sendEachAlert()
                    .then(() => fetchSubscriptions(tradingDrops.length));
                });
            }

            return fetchSubscriptions(tradingDrops.length)
                
        });
    }
}
