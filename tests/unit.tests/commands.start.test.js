const expect = require('chai').expect;
const commands = require('../../components/commands');
const markdown = require('../../components/messageFormats/markdownV2');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']

const chatIDs = ['1234', '5673', '9102', '4567'];

describe('Commands: Start', function() {
    const payload_ = {
        command: { name: 'start' },
        user: { name: 'Adesuwa' }
    };

    it('Reply to start command when first name is present', function() {
        let payload = payload_;

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[i % 2];
            return commands(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.satisfy(message => {
                expect(message.text).to.have.string('Hello Adesuwa');

                return true;
            });

            return true;
        });
    });

    it('Reply to start command when first name is not present but username is', function() {
        let payload = {
            ...payload_,
            user: { username: 'littlezigy' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[i % 2];
            return commands(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages).to.all.satisfy(message => {
                expect(message.text).to.have.string('Hello littlezigy');
                return true;
            });
        });
    });

    it('Introductory message to the start command (telegram)', function() {
        let userDeets = [{ name: 'Adesuwa' }, { username: 'littlezigy' }];

        let payload = payload_;

        let promises = userDeets.map((a, i) => {
            payload.user = a;
            payload.format = formats[i % 2];
            let messenger = messengers[i % 2];
            return commands(payload, messenger);
        });

        return Promise.all(promises)

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.replies).to.have.deep.members([ {text: '/help subscribe' } ]);
            expect(message.text).to.equal('Hello Adesuwa\nI\'m here to alert you on products, artwork released by varying artists.\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.')
        });
    });

    it('Introductory message to the start command (twitter)', function() {
        let payload = {
            command: { name: 'start', },
            user: { username: 'Adesuwa' }
        }

        return commands(payload, 'twitter', markdown)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.replies).to.have.deep.members([ {text: '!help subscribe' } ]);
            expect(message.text).to.equal('Hello Adesuwa\nI\'m here to alert you on products, artwork released by varying artists.\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.')
        });
    });
});
