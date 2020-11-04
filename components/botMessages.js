const conversation = require('./conversation.js');

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

    text += '\nI\'m here to alert you on products, artwork released by varying artists.';
    text += '\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.'
    text += '\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.';
    return {
        text,
        reply_markup: replyMarkup,
        parse_mode: 'Markdown'
    };
}

const subscribeText = function(payload) {
    let text = payload.message.text;
    let replyMarkup = null;

    let answer;
    if(text.indexOf('/subscribe') === 0) {
        if(text.includes('zora'))
            answer = 'You have subscribed to updates from Zora. Whenever releases are made on Zora, you will receive a notification.';
        else if(text.includes('foundation'))
            answer = 'You have subscribed to updates from [Foundation](foundation.app). Whenever releases are made on Foundation, you will receive a notification.';
        else
            answer = 'You will receive alerts whenever releases are made on Zora and Foundation';
    }

    return { text: answer, parse_mode: 'Markdown', ...(replyMarkup != null) && {reply_markup: replyMarkup} };
}

module.exports = {
    prepareResponse: function(payload) {
        let message = {};
        let chatID = payload.message.chat.id;
        let text = payload.message.text;
        if(text.indexOf('/start') === 0 || 
            text.match(/Start/i) || 
            text.match(/Hello/i)
        ) {
            message = start(payload);
        } else if(text.indexOf('/subscribe') === 0) {
            message = subscribeText(payload);
        } else
            message = conversation(payload);

        let parse_mode = 'Markdown';

        return { ...message, chat_id: chatID, parse_mode };
    },

    prepareFailMessage: function(payload) {
        let chatID = payload.message.chat.id;
        return {
            text: 'Action failed. Please check parameters and try again',
            chat_id: chatID
        }
    }

}
