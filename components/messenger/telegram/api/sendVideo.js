const axios = require('axios');

module.exports = (message) => {
    console.log('VIDEO MESSAGE');
    if( !message.url && !message.photo ) 
        throw new Error('No photo message without a picture');
    if( !message.chat_id)
        throw new Error("Please supply chat id");

    let caption = message.text || message.caption;

    let video = message.photo || message.url;

    const url = `https://api.telegram.org/bot${ process.env.TELEGRAM_BOT_TOKEN }/sendVideo`;
    const body = {
        chat_id: message.chat_id,
        duration: 2, width: '500', height: '500', caption, video,
        parse_mode: message.parse_mode,
        method: 'sendVideo'
    }

    return axios.post(url, body)
    .then(res => {
        return res.data;
    });
}
