const Twitter = require('twitter');

module.exports = (id) => {
    const client = new Twitter({
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_SECRET_KEY,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    const body = {
        id
    }

    return new Promise(function(resolve, reject) {
        client.post(`statuses/destroy/${ id }`, body, function(error, response) {

            if(error) {
                reject(error);
            } else
                resolve(response);
        });
    });
}
