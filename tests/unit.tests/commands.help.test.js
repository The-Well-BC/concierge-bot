const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');
const plain = require('../../components/messageFormats/plain');
const markdown = require('../../components/messageFormats/markdown');

describe('Test commands: Help command', function() {
    it('Text help in any case', function() {
        let payload = {
            command: { name: 'help', },
            user: { name: 'Adesuwa' }
        }

        let promises = [
            commands(payload, 'twitter', plain),
            commands(payload, 'telegram', markdown)
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
            commands(payload, 'telegram', plain),
            commands(payload, 'twitter', plain)
        ]

        console.log('PROMISED MESAGE', messageFns[0]);
        return Promise.all(messageFns)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0].text).to.have.string('Hello littlezigy');
        });
    });

    it('Help command: subscribe', function() {
        let payload = {
            command: {
                name: 'help',
                params: [ 'subscribe' ]
            },
            user: { username: 'Adesuwa' }
        }

        return commands(payload, 'twitter', plain)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.text).to.equal('You can subscribe to alerts from only certain platforms. \nTo subscribe to all platforms, simply type !subscribe. To subscribe to alerts from a particular platform, just type !subscribe <platform>.\n If you would like to receive updates from Zora instead, type !subscribe zora.');
            expect(message.replies).to.have.deep.members([
                    {text: '!subscribe'},
                    {text: '!subscribe zora'},
                    {text: '!subscribe nifty'},
                    {text: '!subscribe superrare'},
                    {text: '!subscribe foundation'}
            ]);
        });
    });
});
