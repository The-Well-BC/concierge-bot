const sendText = require('./api/sendText');
const sendPhoto = require('./api/sendPhoto');
const markdown = require('../../messageFormats/markdown');
const prepareMessages = require('./prepareMessages');
const parseMessage = require('./parseMessage');

module.exports = {
    prepareMessages,
    prepareMessage: prepareMessages,
    parseMessage,

    format: markdown,
    formatter: markdown,

    sendMessage(payload, chatIDs) {
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        let messages = prepareMessages(payload, chatIDs);

        let promises = [];

        messages.forEach(message => {
            if(photo) {
                promises.push( sendPhoto(message));
            }
            else {
                return promises.push(sendText(message));
            }
        });

        return Promise.all(promises);
    }
}
