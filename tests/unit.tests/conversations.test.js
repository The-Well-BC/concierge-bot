const expect = require('chai').expect;
const clone = require('rfdc')();
const botMessages = require('../../components/botMessages');
const samplePayload = require('../samplePayload');

describe('Messages', function() {
    it('Hello or Start', function() {
        const payload = clone(samplePayload.chat);

        let messages = [];
        payload.message.text = 'Hello';
        messages.push(botMessages.prepareResponse(payload));

        payload.message.text = 'hello';
        messages.push(botMessages.prepareResponse(payload));

        payload.message.text = 'Start';
        messages.push(botMessages.prepareResponse(payload));

        payload.message.text = 'start';
        messages.push(botMessages.prepareResponse(payload));

        expect(messages).to.all.have.property('text', 'Hello Adesuwa.\nI\'m here to alert you on products, artwork released by varying artists.\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.')
    });

    it('"Subscribe"', function() {
        const payload = clone(samplePayload.chat);
        payload.message.text = 'Subscribe';

        let message = botMessages.prepareResponse(payload);
        expect(message).to.be.an('object');
        expect(message).to.have.keys('text', 'chat_id', 'parse_mode', 'reply_markup');
        expect(message.text).to.equal('Right now, we support two platforms: Zora and Foundation.\nTo Subscribe, simply type */subscribe*. This will subscribe you to alerts from both platforms. To subscribe to alerts from Foundation, type */subscribe foundation*.\nIf you would like to receive updates from Zora instead, type */subscribe zora*.');
        expect(message.reply_markup).to.deep.eql({
            keyboard: [ [
                {text: '/subscribe'},
                {text: '/subscribe zora'},
                {text: '/subscribe foundation'}
            ] ]
        });
    });
});
