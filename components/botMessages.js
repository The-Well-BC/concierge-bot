const start = function(payload) {
    let text = "Hello";
    let replyMarkup = {
            keyboard: [ [
                {text: 'Subscribe'},
                {text: 'Browse'}
            ] ]
    };
    let name = payload.message.chat.first_name || payload.message.chat.username;
    if(name)
        text += ` ${ name }.`;
    else
        text += ".";

    text += `
            I'm here to alert you on products, artwork released by varying artists.
            Right now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.
            Choose 'Subscribe' to learn more about the different services you could subscribe to.`;
    return {
        text,
        reply_markup: replyMarkup
    };
}
const subscribeText = function(payload) {
    let text = 'You have just subscribed to updates';
    return text;
}

module.exports = {
    prepareResponse: function(payload) {
        let message = {};
        let chatID = payload.message.chat.id;
        let text = payload.message.text;
        if(text.indexOf('/start') === 0) {
            message = start(payload);
        } else if(text.indexOf('/subscribe') === 0) {
            message.text = subscribeText(payload);
        }

        return { ...message, chat_id: chatID };
    },

    prepareFailMessage: function(payload) {
        let chatID = payload.message.chat.id;
        return {
            text: 'Action failed. Please check parameters and try again',
            chat_id: chatID
        }
    }

}
