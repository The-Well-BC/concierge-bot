const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');
const plain = require('../../components/messageFormats/plain');
const markdown = require('../../components/messageFormats/markdown');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']

describe('#dev Test commands: Help command', function() {
    it('Help command: subscribe', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe'
            },
            format: 'plain',
            user: { username: 'Adesuwa' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i];
            return commands(payload, 'twitter')
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0].text).to.equal('You can subscribe to certain creators, events (drops, sales, listings, bids, offers), platforms (Nifty Gateway, SuperRare...). Combine subscribe commands to create a subscription filter.\nFor example,\nSubscribe to all drops from creator CryptoKitties on Nifty Gateway.\nUse the options below to find more information on subscription usecases.\nTo view your subscription filters, type subscription filters');
            expect(messages[1].text).to.equal('You can subscribe to certain creators, events (drops, sales, listings, bids, offers), platforms (Nifty Gateway, SuperRare...). Combine subscribe commands to create a subscription filter.\nFor example,\n*Subscribe to all drops from creator CryptoKitties on Nifty Gateway*.\nUse the options below to find more information on subscription usecases.\nTo view your subscription filters, type subscription filters');
            expect(messages).to.all.satisfy(message => {
                expect(message.replies).to.have.deep.members([
                    {text: '!subscribe'},
                    {text: '!help subscribe creators'},
                    {text: '!help subscribe events'},
                    {text: '!help subscribe platforms'},
                    {text: '!help subscription filters'}
                ]);

                return true;
            });
        });
    });

    it('Help command: subscribe platforms', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe platforms'
            },
            format: 'plain',
            user: { username: 'Adesuwa' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2]

            return commands(payload, messenger);
        });


        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages).to.satisfy(arr => {
                expect(messages[0]).to.eql({
                    text: 'You can choose to subscribe to alerts from only certain platforms.\nTo subscribe to all platforms, simply type !subscribe. To subscribe to alerts from a particular platform, just type !subscribe <platform>.\nFor example, if you would like to receive updates from SuperRare, type !subscribe SuperRare.',
                    replies: [
                        {text: '!subscribe nifty'},
                        {text: '!subscribe superrare'},
                    ]
                });

                expect(messages[1]).to.eql({
                    text: 'You can choose to subscribe to alerts from only certain platforms.\nTo subscribe to all platforms, simply type */subscribe*. To subscribe to alerts from a particular platform, just type */subscribe <platform>*.\nFor example, if you would like to receive updates from SuperRare, type */subscribe SuperRare*.',
                    replies: [
                        {text: '/subscribe nifty'},
                        {text: '/subscribe superrare'},
                    ]
                });

                return true;
            });
        });
    });

    it('Help command: subscribe events', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe events'
            },
            format: 'plain',
            user: { username: 'Adesuwa' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2]

            return commands(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages).to.satisfy(arr => {
                expect(messages[0]).to.eql({
                    text: 'You can subscribe to receive alerts whenever certain events occur.\nEvents you can subscribe to include: Sales, Listings, Bids, Offers and Drops/Releases. To subscribe to one or more events, for example sales and drops, type !subscribe sales, drops.',
                    replies: [
                        {text: '!subscribe nifty'},
                        {text: '!subscribe superrare'},
                    ]
                });
                expect(messages[1]).to.eql({
                    text: 'You can subscribe to receive alerts whenever certain events occur.\nEvents you can subscribe to include: Sales, Listings, Bids, Offers and Drops/Releases. To subscribe to one or more events, for example sales and drops, type /subscribe sales, drops.',
                    replies: [
                        {text: '/subscribe nifty'},
                        {text: '/subscribe superrare'},
                    ]
                });

                return true;
            });
        });
    });

    it('Help command: subscribe creators', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe creators'
            },
            format: 'plain',
            user: { username: 'Adesuwa' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2]

            return commands(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0]).to.eql({
                text: 'You can choose to subscribe to one or more creators. To subscribe to a creator, type !subscribe to creator Xen Pluto\n. To subscribe to multiple creators, type !subscribe to creators Xen Pluto, Yen NotPluto.',
                replies: [
                    {text: '!help subscribe'},
                    {text: '!help subscription filters'},
                ]
            });
            expect(messages[1]).to.eql({
                text: 'You can choose to subscribe to one or more creators. To subscribe to a creator, type /subscribe to creator Xen Pluto\n. To subscribe to multiple creators, type /subscribe to creators Xen Pluto, Yen NotPluto.',
                replies: [
                    {text: '/help subscribe'},
                    {text: '/help subscription filters'},
                ]
            });
        });
    });
});
