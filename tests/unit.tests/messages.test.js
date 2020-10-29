const expect = require('chai').expect;
const clone = require('rfdc')();
const botMessages = require('../../components/botMessages');
const samplePayload = require('../samplePayload');

describe('Send messages', function() {
    it('Reply to start command when first name is present', function() {
        let message = botMessages.prepareResponse(samplePayload.commands.start);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'reply_markup', 'chat_id');
        expect(message.text).to.have.string('Hello Adesuwa.');
    });

    it('Reply to start command when first name is not present but username is', function() {
        const payload = clone(samplePayload.commands.start);
        delete payload.message.chat.first_name;
        delete payload.message.from.first_name;

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'reply_markup', 'chat_id');
        expect(message.reply_markup).to.be.an('object');
        expect(message.text).to.have.string('Hello littlezigy.');
    });

    it('Respond to /subscribe command', function() {
        const payload = clone(samplePayload.commands.subscribe);

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'chat_id');
        expect(message.text).to.have.string('subscribed');
    });
});
