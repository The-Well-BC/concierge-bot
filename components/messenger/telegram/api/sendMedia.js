const sendPhoto = require('./sendPhoto');
const sendAnimation = require('./sendAnimation');
const sendVideo = require('./sendVideo');
const sendText = require('./sendText');

module.exports = (message) => {
    let badFile = 'Bad Request: wrong file identifier/HTTP URL specified';
    console.log('\n\nMESSAGE TO SEND', message);
    if( !message.url && !message.photo ) 
        throw new Error('No photo message without a picture');
    if( !message.chat_id)
        throw new Error("Please supply chat id");
    if( message.text ) {
        message.caption = message.text;
        delete message.text;
    }

    message.photo = (message.photo) ? message.photo : message.url;

    return sendPhoto(message)
    .catch(e => {
        if(e.response && e.response.data.description.includes(badFile)) {
            return sendAnimation(message)
            .catch(e => {
                if(e.response && e.response.data.description.includes(badFile)) {
                    return sendVideo(message)
                } else {
                    console.log('ERROR SENDING ANIMATION', e);
                    return sendText(message);
                }
            });
        } else {
            console.log('ERROR SENDING PHOTO\n', e);
            return {}
        }
    });
}
