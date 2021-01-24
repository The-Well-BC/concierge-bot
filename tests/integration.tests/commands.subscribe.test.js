const expect = require('chai').expect;
const clone = require('rfdc')();
const command = require('../../components/commands');
const samplePayload = require('../samplePayload');
const subdao = require('../../components/daos/subscription.dao');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']

const chatIDs = ['1234', '5673', '9102', '4567'];

describe('#dev The Subscribe Command', function() {
    const chatID = '1234';

    const payload = {
        command: { name: 'subscribe' },
        user: { username: 'Adesuwa' }, chatID,
    };

    let subPlatformText =  'Successfully added subscription filter: ';
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Subscribe with no params', function() {
        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2];
            // payload.format = formats[i];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(message => {
            expect(message).to.all.have.property('text');
            expect(message).to.all.have.property('text', 'You have opted to receive notifications whenever any NFTs are traded or released.');
            return subdao.fetchSubscription(chatID)
        }).then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [], messenger: 'telegram' },
                { chatID, filters: [], messenger: 'twitter' },
            ]);
        });
    });

    it('subscribe nft platforms', function() {
        const params = ['superrare', 'nifty, SuperRAre'];

        let promises = params.map((a, i) => {
            payload.command.params = params[i % 2];
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect([res[0]]).to.all.have.property('text', subPlatformText + 'NFT events on SuperRare');
            expect([res[1]]).to.all.have.property('text', subPlatformText + 'NFT events on Nifty Gateway, and SuperRare');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ platforms: ['superrare']}], messenger: 'twitter' },
                { chatID, filters: [{ platforms: ['nifty', 'superrare']}], messenger: 'telegram' },
            ]);
        });
    });

    it('subscribe to events', function() {
        const chatID = '1234';

        const params = ['sale drops', 'listing' ];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res[0]).to.have.property('text', 'Successfully added subscription filter: NFT sales, and drops');
            expect(res[1]).to.have.property('text', 'Successfully added subscription filter: NFT listings');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ events: ['sale', 'drop']}], messenger: 'twitter' },
                { chatID, filters: [{ events: ['listing']}], messenger: 'telegram' }
            ]);
        });
    });


    it('subscribe to NFT creators', function() {
        const params = ['creator Adam Nunberg', 'creator Adam Nunberg, FootPaw' ];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            const single = [ res[0] ];
            const multiple = [ res[1] ];

            expect(res).to.have.lengthOf(2);
            expect(single).to.all.have.property('text', 'Successfully added subscription filter: NFTs created by Adam Nunberg');
            expect(multiple).to.all.have.property('text', 'Successfully added subscription filter: NFTs created by Adam Nunberg, FootPaw');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ creators: ['Adam Nunberg']}], messenger: 'twitter' },
                { chatID, filters: [{ creators: ['Adam Nunberg', 'FootPaw']}], messenger: 'telegram' },
            ]);
        });
    });

    it.skip('subscribe to NFT price filter', function() {
        const params = ['price greater than $1000', 'price less than $1000'];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            // expect(res).to.all.have.property('text', 'Successfully add subscription filter: Subscribe to NFTs created by Adam Nunberg.');
            expect(res[0]).to.have.property('text', 'Successfully add subscription filter: Sales, and drops');
            expect(res[1]).to.have.property('text', 'Successfully add subscription filter: Listings');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ events: ['sale', 'drop']}], messenger: 'telegram' },
                { chatID, filters: [{ events: ['listing', 'FootPaw']}], messenger: 'twitter' }
            ]);
        });
    });

    it.skip('subscribe to transaction price (sale price, bid price, offer price, etc) filter', function() {
        const params = ['transaction price greater than $1000', 'transaction price less than $1000'];

        let promises = params.map((p, i) => {
            payload.command.params = p;
            let messenger = messengers[i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(res => {
            expect(res).to.have.lengthOf(2);
            // expect(res).to.all.have.property('text', 'Successfully add subscription filter: Subscribe to NFTs created by Adam Nunberg.');
            expect(res[0]).to.have.property('text', 'Successfully add subscription filter: Sales, and drops');
            expect(res[1]).to.have.property('text', 'Successfully add subscription filter: Listings');

            return subdao.fetchSubscription(chatID)
        })
        .then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [{ events: ['sale', 'drop']}], messenger: 'telegram' },
                { chatID, filters: [{ events: ['listing', 'FootPaw']}], messenger: 'twitter' }
            ]);
        });
    });
});

