const chai = require('chai');
const expect = chai.expect;

const telegram = require('../../../components/messenger/telegram');

describe('Send Telegram Messsage', function() {
    it('Send text message', function() {
        const message = {
            text: `Testing telegram message method.\nTesting new lines`
        }

        return telegram.sendMessage(message, ['641574672'])
        .then(res => {
            console.log('response', res);
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);

            expect(res.result.chat.id).to.equal(641574672);
            expect(res.result.text).to.equal(message.text);

            expect(res).to.not.have.property('error');
        });
    });
});
