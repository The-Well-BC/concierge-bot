const sendDM = require('./api/sendDM');
const tweet = require('./api/tweet');
const prepareMessages = require('./prepareMessage');

module.exports = (message, chatIDs) => {
    let messageObj = {
        text: message.text,
    }

    if(chatIDs) {
        messageObj.chatID = chatIDs[0]
        return sendDM(messageObj);
    } else
        return tweet(messageObj);
}
