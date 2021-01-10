const chai = require('chai');
const expect = chai.expect;

const sendDM = require('../../../components/messenger/twitter/api/sendDM');

describe.only('Twitter API: Direct Message', function() {
// describe('Twitter API: Direct Message', function() {
    it('#once Send direct message', function() {
        const message = {
            text: 'Create tweet ' + new Date(),
            chatID: '352654309'
        }

        let tweetid;

        return sendDM(message)
        .then(res => {
            expect(res).to.have.key('event');
            expect(res.event).to.have.property('type', 'message_create');
            expect(res.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');
            /*
            tweetid = res.event.id;

            return deleteTweet(tweetid);
            */
        });
    });

    // it.only('#once Send direct message with quick replies', function() {
    it.only('Send direct message with quick replies', function() {
        const message = {
            text: 'Direct message with reply options ' + new Date(),
            chatID: '352654309',
            quick_reply: {
                type: 'options',
                options: [{
                    label: '123'
                }, {
                    label: 'Try this reply'
                }]
            }
        }

        let tweetid;

        return sendDM(message)
        .then(res => {
            expect(res).to.have.key('event');
            expect(res.event).to.have.property('type', 'message_create');
            expect(res.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');
            expect(res.event.message_create.message_data).to.include.keys('text', 'quick_reply');
            expect(res.event.message_create.message_data.quick_reply).to.deep.eql({
                type: 'options',
                options: [{
                    label: '123'
                }, {
                    label: 'Try this reply'
                }]
            });
        });
    });

    it('Send direct message with photo', function() {
        const message = {
            img: 'https://picsum.photos/200',
            text: 'Send Direct message with photo ' + new Date(),
            chatID: '352654309'
        }

        let tweetid;

        return sendDM(message)
        .then(res => {
            expect(res).to.have.key('event');
            expect(res.event).to.have.property('type', 'message_create');
            expect(res.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');
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
});
