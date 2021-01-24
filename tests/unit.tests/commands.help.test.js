const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');
const markdown = require('../../components/messageFormats/markdown');

describe('Test commands: Help command', function() {
    it('Text help in any case', function() {
        let payload = {
            command: { name: 'help', },
            user: { name: 'Adesuwa' }
        }

        let promises = [
            commands(payload, 'twitter'),
            commands(payload, 'telegram')
        ];

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.have.lengthOf(2);
            expect(messages).to.all.satisfy(message => {
                messages.every(message => {
                    expect(message).to.be.an('object').and.have.keys('text', 'replies');
                    return true;

                });

                let plainTextMessage = messages.some(message => {
                    return (message.replies[0].text === '/help subscribe' );
                });
                let markdownMessage = messages.some(message => {
                    return message.replies[0].text === '!help subscribe';
                });

                if(!plainTextMessage) {
                    assert.fail(messages,
                        [{
                            replies: [
                                {text: '/help subscribe'}
                            ]
                        }],
                        'Should have replies for telegram message'); 
                }

                if(!markdownMessage) {
                    assert.fail(messages,
                        [{
                            replies: [
                                {text: '/help subscribe'}
                            ]
                        }],
                        'Should have replies for telegram message'); 
                }

                return true;
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
