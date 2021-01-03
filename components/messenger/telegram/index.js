const sendText = require('./api/sendText');
const sendPhoto = require('./api/sendPhoto');
const markdown = require('../../messageFormats/markdownV2');
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

        console.log('TELEGRAM PAYLOAD', payload);
        let messages = prepareMessages(payload, chatIDs);
//        console.log('MESSAGES', messages);

        if(photo) {
            return sendPhoto(messages[0][0]);
        }
        else {
            return sendText(messages[0][0]);
        }
    }
}
