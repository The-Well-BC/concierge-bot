const expect = require('chai').expect;
const clone = require('rfdc')();

const command = require('../../components/commands');

const thingies = [{format: 'plain', messenger: 'twitter'}, {format:'markdown', messenger:'telegram'}];

describe('Other Commands', function() {
    it('Unrecoginzed command', function() {
        const payload = {
            command: { name: 'pafloopa', },
            user: { username: 'Adesuwa' },
            chatID: 1234
        }

        let promises = thingies.map(o => {
            payload.format = o.format;
            return command(payload, o.messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.property('text', 'Command not recognized. Type in help to see what commands are available');
        });
    });
});

