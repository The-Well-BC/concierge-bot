const fetchDrops = require('./resources/fetchDrops');
const subdao = require('./subscription.dao');
const alertHelper = require('./alerts');
const sendMessage = require('./sendMessage');

module.exports = {
    sendAlerts: function(messages) {
        return fetchDrops()
        .then(tradingDrops => {
            let counter = 0;
            const fetchSubscriptions = function(max) {
                if(counter == tradingDrops.length)
                    return
                console.log('TRADING DROPS', tradingDrops[counter]);
                return subdao.fetchServiceItemSubs({ service: tradingDrops[counter].service, item: tradingDrops[counter].name })
                .then(res => {
                    console.log('GOT SUB ITEMS', res);
                    let messages = alertHelper.alertMessage(res, tradingDrops[counter]);

                    let alertsSent = 0;
                    let sendEachAlert = function() {
                        if( alertsSent === messages.length)
                            return new Promise(resolve => resolve(true));
                        else {
                            return sendMessage(messages[alertsSent])
                            .then(res => {
                                console.log('SENT MESSGAE', res);
                                alertsSent++;
                                return sendEachAlert();
                            });
                        }
                    }

                    counter++;
                    return sendEachAlert()
                    .then(() => fetchSubscriptions(tradingDrops.length));
                });
            }
            console.log('SENDINGA LERTS');


            return fetchSubscriptions(tradingDrops.length)
                
        });
    }
}
