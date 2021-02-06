const sendDM = require('./api/sendDM');
const tweet = require('./api/tweet');
const prepareMessages = require('./prepareMessage');
const uploadMedia = require('./api/uploadImage-chunked');

module.exports = (message, chatIDs) => {
    if( !Array.isArray(chatIDs) )
        chatIDs = [chatIDs];

    let messageObj = {
        text: message.text,
    }

    let imageUrl = message.image || message.img || message.photo || message.url;

    let promises = [];

    chatIDs.forEach(item => {
        if(message.quick_reply)
            messageObj.quick_reply = message.quick_reply;

        if(imageUrl) {
            let msg = {...messageObj, image: imageUrl};

            if(item != 'all')
                msg = {...msg, chatID: item, private: true};

            promises.push( uploadMedia(msg) );
        } else {
            if(item == 'all') {
                promises.push(tweet(messageObj));
            } else {
                messageObj.chatID = item;
                promises.push(sendDM(messageObj));
            }
        }
    });

    return Promise.all(promises);
}
