const sendDM = require('./api/sendDM');
const tweet = require('./api/tweet');
const prepareMessages = require('./prepareMessage');

module.exports = (message, chatIDs) => {
    if( !Array.isArray(chatIDs) )
        chatIDs = [chatIDs];

    let messageObj = {
        text: message.text,
    }

    let promises = [];

    chatIDs.forEach(item => {
        console.log('CHAT ID', item);
        if(message.quick_reply)
            messageObj.quick_reply = message.quick_reply;

        if(item == 'all') {
            promises.push(tweet(messageObj));
        } else {
            messageObj.chatID = item;
            promises.push(sendDM(messageObj));
        }
    });

    return Promise.all(promises);
}
