const chai = require('chai');
const expect = chai.expect;

const directMessage = require('../../../components/messenger/twitter/api/DMs');

describe.skip('Twitter API: Send Tweet', function() {
    it('Send direct message', function() {
        const message = {
            text: 'Create tweet', 
        }

        let tweetid;

        return directMessage.list()
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            tweetid = response.id_str;
            expect(response).to.have.property('text', message.text);

            return deleteTweet(tweetid);
        });
    });

    it('Delete direct message', function() {
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

    it.only('Fetch direct messages', function() {
        const message = {
            text: 'Find this tweet', 
        }
        let id;

        return directMessage.list()
        .then(res => {
            console.log('MESSAGES', res.events);
            console.log('message_create', res.events[0].message_create);
            let response = JSON.parse(res.response.body);
            id = response.id_str;
        });
    });
});
