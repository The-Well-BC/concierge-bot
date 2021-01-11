const chai = require('chai');
const expect = chai.expect;

const tweet = require('../../../components/messenger/twitter/api/tweet');
const deleteTweet = require('../../../components/messenger/twitter/api/deleteTweet');
const fetchTweet = require('../../../components/messenger/twitter/api/fetchTweet');

describe('Twitter API: Send Tweet', function() {
    it('Send tweet', function() {
        const message = {
            text: 'Create tweet' + new Date(), 
        }

        let tweetid;

        return tweet(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            expect(response).to.have.property('text', message.text);
        });
    });
});
