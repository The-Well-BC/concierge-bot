const chai = require('chai');
const expect = chai.expect;

const sendDM = require('../../../components/messenger/twitter/api/sendDM');

describe.only('Twitter API: Direct Message', function() {
    it('Send direct message', function() {
        const message = {
            text: 'Create tweet', 
            chatID: '352654309'
        }

        let tweetid;

        return sendDM(message)
        .then(res => {
            expect(res).to.have.keys('response', 'tweet');
            let response = JSON.parse(res.response.body);
            tweetid = response.id_str;
            expect(response).to.have.property('text', message.text);

            return deleteTweet(tweetid);
        });
    });
});
