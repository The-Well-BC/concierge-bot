const chai = require('chai').use(require('chai-as-promised'));
const expect = chai.expect;
const assert = chai.assert;
const commands = require('../../components/commands');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']
let commandChars = ['', '/'];

describe('Test Help commands: Subscribe help', function() {
    it('#dev Help command: subscribe', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe'
            },
            user: { username: 'Adesuwa' }
        }

        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i];
            return commands(payload, messengers[i % 2])
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.all.have.keys('text', 'replies');
            expect(messages[0].text).to.have.string('subscribe to all drops from creator CryptoKitties on Nifty Gateway.', 'subscription filters');
            expect(messages[1].text).to.have.string('*subscribe to all drops from creator CryptoKitties on Nifty Gateway*.', '*type subscription filters*');

            expect(messages).to.satisfy(arr => {
                return arr.every((message, i) => {
                    expect(message.text).to.match(/^You can subscribe to certain creators, events \(drops, sales, listings, bids, offers\), platforms \(Nifty Gateway, SuperRare\.\.\.\)/);
                    expect(message.text).to.have.string('\n\nCombine subscribe commands to create a subscription filter.\nFor example,\n', '\n\nUse the options below to find more information on subscription usecases.\n\nTo view your subscription filters, type');

                    let c = commandChars[i];
                    expect(message.replies).to.have.deep.members([
                        {text: `${c}subscribe`},
                        {text: `${c}help subscribe creators`},
                        {text: `${c}help subscribe events`},
                        {text: `${c}help subscribe platforms`},
                        {text: `${c}help subscription filters`}
                    ]);

                    return true;
                });
            });
        });
    });

    it('Help command: subscribe platforms', function() {
        let payload = {
            command: {
                name: 'help',
                params: 'subscribe platforms'
            },
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
                expect(messages[0].text).to.have.string(
                    '!subscribe','!subscribe <platform>.', '!subscribe SuperRare.'
                );

                expect(messages[1].text).to.have.string( '*/subscribe*', '*/subscribe <platform>*', '*/subscribe SuperRare*');

                return arr.every((message, i) => {
                    let c = commandChars[i];
                    expect(message.replies).to.have.deep.members([
                        {text: `${c}subscribe nifty`},
                        {text: `${c}subscribe superrare`},
                        {text: `${c}subscribe zora`},
                        {text: `${c}subscribe foundation`},
                    ]);

                    expect(message.text).to.match(/You can choose to subscribe to alerts from only certain platforms.\nTo subscribe to all platforms, simply type \*?[\!\/]subscribe\*?\.\nTo subscribe to alerts from a particular platform, just type \*?[!\/]subscribe <platform>\*?.\nFor example, if you would like to receive updates from SuperRare, type \*?[!\/]subscribe SuperRare/);

                    return true;
                });
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
                return arr.every((message, i) => {
                    let c = commandChars[i];
                    expect(message.text).to.match(/You can subscribe to receive alerts whenever certain events occur.\nEvents you can subscribe to include\: Sales, Listings, Bids, Offers and Drops\/Releases\. To subscribe to one or more events, for example sales and drops, type [!\/]subscribe sales, drops\./);

                    expect(message.replies).to.have.deep.members([
                        {text: `${c}subscribe nifty`},
                        {text: `${c}subscribe superrare`},
                        {text: `${c}subscribe zora`},
                        {text: `${c}subscribe foundation`},
                    ]);

                    return true;
                });
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
