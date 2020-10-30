const axios = require('axios');

module.exports = (message) => {
    const url = `https://api.telegram.org/bot${ process.env.BOT_TOKEN }/sendMessage`;
    const body = { ...message }
    return axios.post(url, body)
    .then(res => {
        console.log('DONE',res.data);
        return res.data;
    }).catch(e => {
        console.log('ERRO', e);
        throw e;
    });
}
