module.exports = (payload) => {
    let text;
    let replyMarkup = null;
    
    let usertext = payload.message.text;

    if(usertext.indexOf('Subscribe') === 0) {
        text = 'Right now, we support two platforms: Zora and Foundation.'
        text += '\nTo Subscribe, simply type */subscribe*. This will subscribe you to alerts from both platforms. To subscribe to alerts from Foundation, type */subscribe foundation*.';
        text += '\nIf you would like to receive updates from Zora instead, type */subscribe zora*.';

        replyMarkup = {
            keyboard: [ [
                {text: '/subscribe'},
                {text: '/subscribe zora'},
                {text: '/subscribe foundation'}
            ] ]
        }

    } else 
        text = 'I don\'t understand what you are trying to say';

    return { text, ...(replyMarkup != null) && {reply_markup: replyMarkup} };
}
