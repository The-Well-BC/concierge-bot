const expect = require('chai').expect;
const clone = require('rfdc')();

const command = require('../../components/commands');

const plain = require('../../components/messageFormats/plain');
const markdown = require('../../components/messageFormats/markdownV2');

describe('Other Commands', function() {
    it('Unrecoginzed command', function() {
        const payload = {
            command: { name: 'pafloopa', },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        let promises = [
            command(payload, 'telegram', markdown),
            command(payload, 'twitter', plain)
        ]

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.property('text', 'Command not recognized. Type in help to see what commands are available');
        });
    });
});

