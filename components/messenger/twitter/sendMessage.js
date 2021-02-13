const sendDM = require('./api/sendDM');
const tweet = require('./api/tweet');
const prepareMessages = require('./prepareMessage');
const uploadMedia = require('./api/uploadImage-chunked');

module.exports = (message, chatIDs) => {
    if( !Array.isArray(chatIDs) )
        chatIDs = [chatIDs];

    let messages = prepareMessages(message, chatIDs);

    let promises = [];

    messages.forEach(item => {
        console.log('MESSAGE ITEM', item);
        if(item.photo) {
            let msg = {...item, image: item.photo};

            if(item.chatID)
                msg = {...msg, chatID: item.chatID, private: true};

            promises.push( uploadMedia(msg) );
        } else {
            if(item.chatID) {
                promises.push(sendDM(item));
            } else {
                promises.push(tweet(item));
            }
        }
    });

    return Promise.all(promises);
}
