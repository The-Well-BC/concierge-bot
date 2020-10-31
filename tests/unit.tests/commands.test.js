const expect = require('chai').expect;
const clone = require('rfdc')();
const botMessages = require('../../components/botMessages');
const samplePayload = require('../samplePayload');

describe('Start Command', function() {
    it('Reply to start command when first name is present', function() {
        let messages = [];
        let payload = samplePayload.commands.start;

        messages.push(botMessages.prepareResponse(payload));

        payload.message.text = '/help';
        messages.push(botMessages.prepareResponse(payload));

        expect(messages).to.all.have.keys('text', 'reply_markup', 'parse_mode', 'chat_id');
        expect(messages[0].text).to.have.string('Hello Adesuwa.');
    });

    it('Reply to start command when first name is not present but username is', function() {
        const payload = clone(samplePayload.commands.start);
        delete payload.message.chat.first_name;
        delete payload.message.from.first_name;

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'reply_markup', 'chat_id', 'parse_mode');
        expect(message).to.have.property('parse_mode', 'Markdown');
        expect(message.reply_markup).to.be.an('object');
        expect(message.text).to.have.string('Hello littlezigy.');
    });

    it('Introductory message to the start command', function() {
        let message = botMessages.prepareResponse(samplePayload.commands.start);
        expect(message).to.be.an('object');
        expect(message.text).to.equal('Hello Adesuwa.\nI\'m here to alert you on products, artwork released by varying artists.\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.')
    });
});

describe('The Subscribe Command', function() {
    it('/subscribe', function() {
        const payload = clone(samplePayload.commands.subscribe);

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'parse_mode', 'chat_id');
        expect(message).to.have.property('parse_mode', 'Markdown');
        expect(message.text).to.equal('You will receive alerts whenever releases are made on Zora and Foundation');
    });
    it('/subscribe service', function() {
        const payload = clone(samplePayload.commands.subscribe);
        payload.message.text = '/subscribe zora';

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'chat_id', 'parse_mode');
        expect(message.text).to.equal('You have subscribed to updates from Zora. Whenever releases are made on Zora, you will receive a notification.');
    });
});
