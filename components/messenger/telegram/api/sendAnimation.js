const axios = require('axios');

module.exports = (message) => {
    if( !message.url && !message.photo ) 
        throw new Error('No photo message without a picture');
    if( !message.chat_id)
        throw new Error("Please supply chat id");

    let caption = message.text || message.caption;

    let animation = message.photo || message.url;

    const url = `https://api.telegram.org/bot${ process.env.TELEGRAM_BOT_TOKEN }/sendAnimation`;
    const body = {
        chat_id: message.chat_id,
        duration: 3, caption, animation,
        parse_mode: message.parse_mode,
        method: 'sendAnimation'
    }

    console.log('BODY NAMIATION', body);
    return axios.post(url, body)
    .then(res => {
        return res.data;
    });
}
