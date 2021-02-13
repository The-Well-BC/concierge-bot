const chai = require('chai');
const expect = chai.expect;

const tweet = require('../../../components/messenger/twitter/api/tweet');
const deleteTweet = require('../../../components/messenger/twitter/api/deleteTweet');
const fetchTweet = require('../../../components/messenger/twitter/api/fetchTweet');

describe('Twitter API: Send Tweet', function() {
    it('Send tweet', function() {
        const message = {
            text: 'Send tweet with link attachment\n' + new Date(),
            link: 'https://superrare.co/artwork-v2/Merchant-19272'
        }

        let tweetid;

        return tweet(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = res.response;
            expect(response).to.have.property('text', message.text);
        });
    });
});
