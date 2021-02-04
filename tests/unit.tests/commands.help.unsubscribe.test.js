const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');

let commandChars = ['!', '/'];
let messengers = ['twitter', 'telegram'];

describe.only('#dev Test commands: Help Unsubscribe command', function() {
    it('Text help in any case', function() {
        let payload = {
            command: { name: 'help', params: 'unsubscribe'},
            user: { name: 'Adesuwa' }
        }

        let promises = messengers.map(messenger => {

            return commands(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.have.lengthOf(2);
            expect(messages).to.all.satisfy(message => {
                return messages.every((message, i) => {

                    let c = commandChars[i];
                    expect(message).to.be.an('object').and.have.keys('text');

                    expect(message.text).to.equal('Text unsubscribe to stop receiving all messages');
                    return true;

                });
            });
        });
    });
});
