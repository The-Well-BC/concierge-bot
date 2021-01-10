const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

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

        let promises = [
            commands(payload, 'telegram', markdown),
            commands(payload, 'twitter', markdown)
        ]

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0].text).to.contain('NFTs released');
            expect(messages[1].text).to.contain('NFTs released');

            expect(messages[0].replies).to.all.satisfy(r => {
                assert.match(r.text, /\/subscribe creator/);
                assert.notMatch(r.text, /undefined creator/);
                return true;
            });
            expect(messages[1].replies).to.all.satisfy(r => {
                assert.match(r.text, /!subscribe creator/);
                assert.notMatch(r.text, /undefined creator/);
                return true;
            });
        });
    });
});

