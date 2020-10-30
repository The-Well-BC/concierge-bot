const axios = require('axios');

module.exports = (message) => {
    if( !message.url && !message.photo ) 
        throw new Error('No photo message without a picture');
    if( !message.chat_id)
        throw new Error("Please supply chat id");
    if( message.text ) {
        message.caption = message.text;
        delete message.text;
    }

    message.photo = (message.photo) ? message.photo : message.url;

    const url = `https://api.telegram.org/bot${ process.env.BOT_TOKEN }/sendPhoto`;
    const body = { ...message }
    return axios.post(url, body)
    .then(res => {
        return res.data;
    }).catch(e => {
        throw e;
    });
}
