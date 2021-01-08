const Twitter = require('twit');
const links = require('../../../../config/links');

const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_SECRET_KEY,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// client.post('direct_messages/events/new', { event: body }, function(error, tweet, response) {
client.post(`account_activity/all/production/webhooks.json?url=https://tradedrops.bot.adesuwa.dev/${ links.twitterWebhook }`, (error, response) => {

    if(error) {
        console.log(error);
    } else
        console.log({ response });
});
/*
const Twitter = require('twitter');

const twitterWebhooks = require('twitter-webhooks');
const links = require('../../../../config/links');
console.log('TWITTER WEBHOK', links.twitterWebhook);

const twitterParams = {
    serverUrl: 'https://tradedrops.bot.adesuwa.dev',
    route: links.twitterWebhook,
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_SECRET_KEY,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}

const userActivityWebhook = twitterWebhooks.userActivity(twitterParams);
console.log('USER ACTIVITY', twitterParams);
userActivityWebhook.register();

/*

console.log('TWITTER', twitterParams);

client.post(`account_activity/webhooks.json?url=https://tradedrops.bot.adesuwa.dev/${ links.twitterWebhook }`, (error, response) => {
    if(error)
        console.log('ERROR', error);
    else
    console.log('CHANTGED WEBIJO', response);
});
*/
