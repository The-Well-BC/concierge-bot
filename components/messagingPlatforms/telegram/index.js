const sendText = require('./api/sendText');
const sendPhoto = require('./api/sendPhoto');
const markdown = require('../../messageFormats/markdownV2');
const prepareMessages = require('./prepareMessages');

module.exports = {
    sendAlerts(chatIDs, payload) {
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        let texts = payload.map(p => markdown.alertMessage(p));
        let messages = prepareMessages(chatIDs, texts);

        let alertsSent = 0;

        let sendEachAlert = function(set) {
            console.log('MESSAGES');
            console.log( set[alertsSent])
            if( alertsSent === set.length)
                return new Promise(resolve => resolve(true));
            else {
                if(set[alertsSent].photo) {
                    return sendPhoto(set[alertsSent])
                    .then(res => {
                        alertsSent++;
                        return sendEachAlert();
                    });
                }
                else {
                    return sendText(set[alertsSent])
                    .then(res => {
                        alertsSent++;
                        return sendEachAlert();
                    });
                }
            }
        }

        return messages.forEach(set => {
            return sendEachAlert(set)
            .then(() => fetchSubscriptions(tradingDrops.length));
        });
    }
}
