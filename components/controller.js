const bot = require('./bot');
const links = require('../config/links');

const crypto = require('crypto');

module.exports = {
    receiveBotMessage: (req, res) => {
        let messenger;

        if(req.path == links.twitterWebhook) 
            messenger = 'twitter';
        else 
            messenger = 'telegram';

        return bot.receiveMessage(req.body, messenger)
        .then(result => {
            return res.send(result);
        });
    },

    twitterCRCchallenge: (req, res) => {
        const crc_token = req.query.crc_token;

        const consumerSecret = process.env.TWITTER_SECRET_KEY;
        const hmac = crypto.createHmac('sha256', consumerSecret).update(crc_token).digest('base64');

        const response_token = 'sha256='+ hmac;

        return res.send({ response_token });
    }
}
