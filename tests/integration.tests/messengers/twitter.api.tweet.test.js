const chai = require('chai');
const expect = chai.expect;

const tweet = require('../../../components/messenger/twitter/api/tweet');
const deleteTweet = require('../../../components/messenger/twitter/api/deleteTweet');
const fetchTweet = require('../../../components/messenger/twitter/api/fetchTweet');

describe('Twitter API: Send Tweet', function() {
    it('Send tweet', function() {
        const message = {
            text: 'Create tweet', 
        }

        let tweetid;

        return tweet(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            tweetid = response.id_str;
            expect(response).to.have.property('text', message.text);

            return deleteTweet(tweetid);
        });
    });

    it('Delete tweet', function() {
        const message = {
            text: 'Delete this tweet', 
        }

        let tweetid;

        return tweet(message)
        .then(res => {
            let response = JSON.parse(res.response.body);
            tweetid = response.id_str;

            return deleteTweet(tweetid)
        }).then(res => {
            return expect(fetchTweet(tweetid)).to.eventually.be.rejected;
        });
    });

    it('Fetch tweet', function() {
        const message = {
            text: 'Find this tweet', 
        }
        let id;

        return tweet(message)
        .then(res => {
            let response = JSON.parse(res.response.body);
            id = response.id_str;

            return fetchTweet(id)
        })
        .then(res => {
            expect(res).to.have.property('text', message.text);
            return deleteTweet(id)
        });
    });
});
