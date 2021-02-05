const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');

let commandChars = ['!', '/'];
let messengers = ['twitter', 'telegram'];
const formats = ['plain', 'markdown'];

describe('Test commands: Help - Subscription filters', function() {
    it('Subscription filters', function() {
        let params = ['subscription filter', 'subscription filters', 'subscription Filters', 'subscriptionFilter', 'filters', 'filter'];

        let payload = {
            command: { name: 'help',},
            user: { name: 'Adesuwa' }
        }

        let promises = messengers.map(messenger => {
            return params.map((param, i) => {
                payload.format = formats[i % 2];
                payload.command.params = param;
                return commands(payload, messenger);
            });
        }).flat();

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.satisfy(message => {
                return messages.every((message, index) => {

                    let i = (index < params.length) ? 0 : 1;
                    let c = commandChars[i];
                    expect(message).to.be.an('object').and.have.keys('text', 'replies');

                    let star = (index % 2 === 0) ? '' : '*';

                    expect(message.text).to.equal(`Your subscription filters determine the type of alerts you will get. Subscription filters are created when you use the ${c}subscribe command.\nYou can combine one or more conditions into a single filter. For example:\n\n${star}${c}subscribe sales\n${c}subscribe to creator Maalavidaa drops${star}\n\nYou will only receive messages that pass one or more of your filters.\nTo view your filters, text ${c}filters.`);

                    expect(message.replies).to.have.deep.members([
                        {text: `${c}filters` },
                        {text: `${c}help subscribe` }
                    ]);

                    return true;

                });
            });
        });
    });
});
