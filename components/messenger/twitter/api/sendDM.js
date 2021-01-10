const Twitter = require('twit');

module.exports = (payload) => {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_SECRET_KEY,
        access_token: process.env.TWITTER_BOT_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_BOT_ACCESS_TOKEN_SECRET,
    });

    const body = {
        type: 'message_create',
        message_create: {
            target: {
                recipient_id: payload.chatID
            },
            message_data: {
                text: payload.text,
                ...(payload.quick_reply) && { quick_reply: payload.quick_reply}
            }
        }
    };

    return new Promise(function(resolve, reject) {
        client.post('direct_messages/events/new', {event: body}, function(error, tweet, response) {
            if(error) {
                reject(error);
            } else
                resolve(tweet);
        });
    });
}
