const expect = require('chai').expect;
const commands = require('../../components/commands');
const markdown = require('../../components/messageFormats/markdownV2');

describe('Test commands: Markdown edition', function() {
    it('Reply to start command when first name is present', function() {
        let payload = {
            command: { name: 'start', },
            user: { name: 'Adesuwa' }
        }

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message.text).to.have.string('Hello Adesuwa');
        });
    });

    it('Reply to start command when first name is not present but username is', function() {
        let payload = {
            command: { name: 'start', },
            user: { username: 'littlezigy' }
        }

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.text).to.have.string('Hello littlezigy');
        });
    });

    it('Introductory message to the start command (telegram)', function() {
        let payload = {
            command: { name: 'start', },
            user: { username: 'Adesuwa' }
        }

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

    it('Help command: subscribe (twitter)', function() {
        let payload = {
            command: {
                name: 'help',
                params: [ 'subscribe' ]
            },
            user: { username: 'Adesuwa' }
        }

        return commands(payload, 'twitter', markdown)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.text).to.equal('You can subscribe to alerts from only certain platforms. \nTo subscribe to all platforms, simply type *!subscribe*. To subscribe to alerts from a particular platform, just type *!subscribe <platform>*.\n If you would like to receive updates from Zora instead, type *!subscribe zora*.');
            expect(message.replies).to.have.deep.members([
                {text: '!subscribe'},
                {text: '!subscribe zora'},
                {text: '!subscribe nifty'},
                {text: '!subscribe superrare'},
                {text: '!subscribe foundation'}
            ]);
        });
    });

    it('Help command: subscribe (telegram)', function() {
        let payload = {
            command: {
                name: 'help',
                params: [ 'subscribe' ]
            },
            user: { username: 'Adesuwa' }
        }

        return commands(payload, 'telegram', markdown)
        .then(message => {
            expect(message).to.be.an('object').and.have.keys('text', 'replies');
            expect(message.text).to.equal('You can subscribe to alerts from only certain platforms. \nTo subscribe to all platforms, simply type */subscribe*. To subscribe to alerts from a particular platform, just type */subscribe <platform>*.\n If you would like to receive updates from Zora instead, type */subscribe zora*.');
            expect(message.replies).to.have.deep.members([
                {text: '/subscribe'},
                {text: '/subscribe zora'},
                {text: '/subscribe nifty'},
                {text: '/subscribe superrare'},
                {text: '/subscribe foundation'}
            ]);
        });
    });
});
