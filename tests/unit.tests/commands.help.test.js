const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');

let commandChars = ['!', '/'];
let messengers = ['twitter', 'telegram'];

describe('Test commands: Help command', function() {
    it('Text help in any case', function() {
        let payload = {
            command: { name: 'help', },
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
                    expect(message).to.be.an('object').and.have.keys('text', 'replies');

                    expect(message.replies).to.have.deep.members([
                        {text: `${c}help subscribe`},
                        {text: `${c}help unsubscribe`},
                    ]);
                    return true;

                });
            });
        });
    });

    it('Reply to start command when first name is not present but username is', function() {
        let payload = {
            command: { name: 'start', },
            user: { username: 'littlezigy' }
        }

        let messageFns = [
            commands(payload, 'telegram'),
            commands(payload, 'twitter')
        ]

        return Promise.all(messageFns)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0].text).to.have.string('Hello littlezigy');
        });
    });
});
