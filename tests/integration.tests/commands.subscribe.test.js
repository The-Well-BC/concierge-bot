const expect = require('chai').expect;
const clone = require('rfdc')();
const botMessages = require('../../components/commands');
const samplePayload = require('../samplePayload');

const markdown = require('../../components/messageFormats/markdownV2');

describe('The Subscribe Command', function() {
    it('/subscribe', function() {
        const payload = {
            command: { name: 'subscribe', },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        let message = botMessages(payload, 'telegram', markdown);
        expect(message).to.be.an('object');
        expect(message.text).to.equal('You will receive alerts whenever releases are made on Zora and Foundation');
    });
    it('/subscribe service', function() {
        const payload = {
            command: {
                name: 'subscribe',
                params: [ 'zora' ]
            },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        let message = botMessages(payload, 'telegram', markdown);
        expect(message).to.be.an('object');
        expect(message.text).to.equal('You have subscribed to updates from Zora. Whenever releases are made on Zora, you will receive a notification.');
    });
});

