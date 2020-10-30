const chai = require('chai');
const expect = chai.expect;

const sendMessage = require('../../components/sendMessage');

describe('Send Message', function() {
    it('Send text message', function() {
        const message = {
            text: 'Testing... testing...', 
            chat_id: 641574672
        }

        return sendMessage(message)
        .then(res => {
            expect(res).to.not.have.property('error');
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);
        });
    });
});
