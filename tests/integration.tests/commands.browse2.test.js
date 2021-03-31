const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const clone = require('rfdc')();
const commands = require('../../components/commands/command.browse');
const samplePayload = require('../samplePayload');
const formatter = require('../../components/messages');

describe('#dev The Browse Command', function() {
    const payload_ = {
        command: { },
        user: { username: 'Adesuwa' },
        chatID: 1234
    };

    const messengers = ['twitter', 'telegram'];

    it('Browse creators', function() {
        const payload = {
            ...payload_,
            command: {
                name: 'browse',
                params: 'creators'
            },
        }

        let promises = messengers.map(m => {
            return commands(payload, m, formatter, payload.command, true);
        }).flat();

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');

            expect(messages).to.all.satisfy(message => {
                expect(message.text).to.equal('Artist 1 - Artist is a great artist\n'
                    + '\n'
                    + 'Artist 2 - Artist is an even artist\n'
                    + '\n'
                    + 'Artist 3 - Artist is a great artist'
                );

                expect(message.replies).to.have.deep.members([
                    {text: 'subscribe creator Artist 1'},
                    {text: 'subscribe creator Artist 2'},
                    {text: 'subscribe creator Artist 3'},
                    {text: 'Next', type: 'pagination'},
                    {text: 'Prev', type: 'pagination'}
                ]);
                expect(message.replies).to.all.satisfy(r => {
                    expect(r.text).to.contain('subscribe to "Artist 1"');
                    assert.notMatch(r.text, /undefined creator/);
                    return true;
                });

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

