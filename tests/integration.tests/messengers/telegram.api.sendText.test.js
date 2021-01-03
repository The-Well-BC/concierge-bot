const chai = require('chai');
const expect = chai.expect;

const sendMessage = require('../../../components/messenger/telegram/api/sendText');

describe.only('Telegram API: Send Message', function() {
    it('Send text message', function() {
        const message = {
            text: 'Testing... testing...', 
            chat_id: 641574672,
            reply_markup: {
                keyboard: [
                    [ { text: 'TExt one' }],
                    [ 'onethree']
                ]
            }
        }

        return sendMessage(message)
        .then(res => {
            expect(res).to.not.have.property('error');
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);
        });
    });
});
