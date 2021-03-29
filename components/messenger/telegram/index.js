const sendText = require('./api/sendText');
const sendMedia = require('./api/sendMedia');
const prepareMessages = require('./prepareMessages');
const parseMessage = require('./parseMessage');

module.exports = {
    prepareMessages,
    prepareMessage: prepareMessages,
    parseMessage,

    format: 'markdownV2',

    sendMessage(payload, chatIDs) {

        let messages = prepareMessages(payload, chatIDs);

        let promises = [];

        messages.forEach(message => {
            let photo = (message.photo) ?
                message.photo : null;

            if(photo) {
                promises.push( sendMedia({ ...message, photo }));
            }
            else {
                return promises.push(sendText(message));
            }
        });

        return Promise.all(promises);
    }
}
