const errMessages = require('./errorMessages');
const telegram = require('./messenger/telegram');

module.exports = {
    prepareFailMessage: function(payload) {
        let chatID = payload.message.chat.id;
        return {
            text: 'Action failed. Please check parameters and try again',
            chat_id: chatID
        }
    }, 
    errorMessage: function(err, chatID) {
        console.log('CHAT ID', chatID);
        if(err.message == 'invalid_platform') {
            if(err.messenger == 'telegram') {
                let mess =  errMessages(err).invalid_platform.telegram;
                return telegram.prepareMessage({ text: mess }, chatID);
            }
        }
    }

}
