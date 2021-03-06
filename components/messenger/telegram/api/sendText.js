const axios = require('axios');

module.exports = (message) => {
    const url = `https://api.telegram.org/bot${ process.env.TELEGRAM_BOT_TOKEN }/sendMessage`;
    const body = { ...message }

    return axios.post(url, body)
    .then(res => {
        return res.data;
    }).catch(e => {
        console.error('TEXT ERRO', e);
        throw e;
    });
}
