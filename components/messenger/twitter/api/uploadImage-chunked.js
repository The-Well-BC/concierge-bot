const Twitter = require('twitter');
const randomString = require('randomstring');
const axios = require('axios');

const sendDm = require('./sendDM');
const tweet = require('./tweet');

module.exports = (payload) => {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_SECRET_KEY,
        access_token_key: process.env.TWITTER_BOT_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_BOT_ACCESS_TOKEN_SECRET,
    });

    let image = payload.image || payload.url || payload.url;

    return axios.get(image, { responseType: 'arraybuffer' })
    .then(res => {
        let img = res.data;

        let mediaType = res.headers['content-type'];
        let fileSize = res.headers['content-length'];
        let mediaID;

        return client.post('media/upload', {
            command: 'INIT',
            media_type: mediaType,
            total_bytes: fileSize
        }).then(data => {
            mediaID = data.media_id_string;

            return client.post('media/upload', {
                command: 'APPEND',
                media_id: mediaID,
                media: img,
                segment_index: 0
            })
        }).then(data => {
            return client.post('media/upload', {
                command: 'FINALIZE',
                media_id: mediaID
            })
        }).then(data => {
            let body = { ...payload, mediaID };

            if(payload.private === true || payload.chatID) {
                return sendDm(body);
            } else {
                return tweet(body);
            }
        }).catch(e => {
            console.log('ERROR DURINGIMG OUPIODAD', e);
            throw e;
        });
    });
}

