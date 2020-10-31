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
    let text = payload.message.text;

    let answer;
    if(text.indexOf('/subscribe') === 0) {
        if(text.includes('zora'))
            answer = 'You have subscribed to updates from Zora. Whenever releases are made on Zora, you will receive a notification.';
        else if(text.includes('foundation'))
            answer = 'You have subscribed to updates from Foundation. Whenever releases are made on Foundation, you will receive a notification.';
        else
            answer = 'You will receive alerts whenever releases are made on Zora and Foundation';
    }
    else if(text.indexOf('Subscribe') === 0) {
        answer = 'Right now, we support two platforms: Zora and Foundation.'
        answer += 'To Subscribe, simply type */subscribe*. This will subscribe you to alerts from both platforms. To subscribe to alerts from Foundation, type */subscribe foundation*.';
        answer += 'If you would like to receive updates from Zora instead, type */subscribe zora**.';
    }
    return answer;
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
        } else if(text.indexOf('Subscribe') === 0) {
            message.text = subscribeText(payload)
        } else
            message.text = 'I don\'t understand what you are trying to say';

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
