const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const clone = require('rfdc')();
const commands = require('../../components/commands');
const samplePayload = require('../samplePayload');

describe('The Browse Command', function() {
    const payload_ = {
        command: { },
        user: { username: 'Adesuwa' },
        chatID: 1234
    };

    it('/browse', function() {
        const payload = {
            ...payload_,
            command: { name: 'browse' }
        }

        return commands(payload, 'telegram')
        .then(message => {
            expect(message).to.be.an('object');
            expect(message).to.include.keys('text', 'replies');
            expect(message.replies).to.have.deep.members([
                {text: '/browse creators' }
            ]);
            expect(message.text).to.equal('Browse and subscribe to creators, NFT categories');
        });
    });
});
