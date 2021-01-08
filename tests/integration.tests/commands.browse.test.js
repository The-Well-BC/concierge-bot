const expect = require('chai').expect;
const clone = require('rfdc')();
const commands = require('../../components/commands');
const samplePayload = require('../samplePayload');

const markdown = require('../../components/messageFormats/markdownV2');

describe('The Browse Command', function() {
    it('/browse', function() {
        const payload = {
            command: { name: 'browse', },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message).to.be.an('object');
            expect(message).to.include.keys('text', 'replies');
            expect(message.replies).to.have.deep.members([
                {text: '/browse creators' }
            ]);
            expect(message.text).to.equal('Browse and subscribe to creators, NFT categories');
        });
    });

    it('Browse creators', function() {
        const payload = {
            command: {
                name: 'browse',
                params: [ 'creators' ]
            },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message).to.be.an('object');
            expect(message.text).to.equal('You have subscribed to updates from Zora. Whenever releases are made on Zora, you will receive a notification.');
        });
    });
});

