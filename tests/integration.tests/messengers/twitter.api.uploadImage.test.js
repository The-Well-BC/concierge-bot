const chai = require('chai');
const expect = chai.expect;

const tweetPhoto = require('../../../components/messenger/twitter/api/uploadImage-chunked');
const chatID = require('../../twitterSamplePayload').chatID;

describe('#dev Twitter API: Send Tweet', function() {
    it('Send photo tweet', function() {
        const message = {
            url: 'https://picsum.photos/200',
            text: 'Create photo tweet\n' + new Date(), 
        }

        let tweetid;

        return tweetPhoto(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            expect(response).to.have.property('text', message.text);
        });
    });

    it('Send photo private message', function() {
        const message = {
            url: 'https://ipfs.pixura.io/ipfs/QmbrnmurqqDMw9qwiUwtonNXtRaTmFXrQF9KHboXC1HdAq/inner-peace.jpg',
            text: 'Create photo dm\n' + new Date(), 
            chatID,
            private: true
        }

        let tweetid;

        return tweetPhoto(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet', 'media');
            let response = JSON.parse(res.response.body);
            expect(response).to.have.property('text', message.text);
        });
    });
});
