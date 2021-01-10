const chai = require('chai');
const expect = chai.expect;

const twitter = require('../../../components/messenger/twitter');

describe('Twitter methods: Send Text Message', function() {
    it('Send private message', function() {
        const message = {
            text: 'Succeeded in sending text only DM ' + new Date(),
            private: true
        }

        let tweetid;

        return twitter.sendMessage(message, ['352654309'])
        .then(res => {
            expect(res).to.have.key('event');
            expect(res.event).to.have.property('type', 'message_create');
            expect(res.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');
        });
    });

    it('Send text tweet', function() {
        const message = {
            text: 'Send text only DM ' + new Date(),
            private: false
        }

        let tweetid;

        return twitter.sendMessage(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            tweetid = response.id_str;
            expect(response).to.have.property('text', message.text);
        });
    });

    it.skip('Send photo with caption', function() {
        const message = {
            img: 'https://picsum.photos/200',
            text: `Testing... testing...\nMultiline string\nHowwill bot handle this??`, 
            chat_id: 641574672
        }

        return twitter.sendMessage(message, ['641574672'])
        .then(res => {
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);

            expect(res.result.chat.id).to.equal(641574672);
            expect(res.result).to.have.property('caption', message.text);
            expect(res.result).to.have.property('photo');

            expect(res).to.not.have.property('error');
        });
    });
});

