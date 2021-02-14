const expect = require('chai').expect;
const clone = require('rfdc')();
const command = require('../../components/commands');
const samplePayload = require('../samplePayload');
const subdao = require('../../components/daos/subscription.dao');

const formats = ['plain', 'markdown'];
const messengers = ['twitter', 'telegram']
const teardown = require('../teardown');

let commandChars = ['!', '/'];

describe.only('#dev The Subscription Filter Command', function() {
    const chatID = '1234';

    const payload = {
        command: { name: 'filter' },
        user: { username: 'Adesuwa' }, chatID,
    };

    let subPlatformText =  'Successfully added subscription filter: ';
    beforeEach(() => {
        return teardown()
        .then(() => {
            let eventsArr = [['sale', 'bid'], ['drop']];

            let promises = Array.apply(null, {length: 2}).map((a, i) => {
                let messenger = messengers[ i % 2];
                return eventsArr.map((events, a) => {

                    let filter = (a == 0) ? { txPriceGTE: '$325', platforms: ['zora'] } : {};
                    filter.events = events;
                    return subdao.addSubscription(chatID, messenger, filter)
                });

            }).flat();

            return Promise.all(promises)
            .then(message => subdao.fetchSubscription(chatID))
            .then(res => {
                expect(res).to.have.lengthOf(2);
                /*
                expect(res).to.have.deep.members([
                    { chatID, filters: [ {events: ['sale', 'bid'], txPriceGTE: '$325'}, {events: ['drop']} ], messenger: 'twitter' },
                    { chatID, filters: [ {events: ['sale', 'bid'], txPriceGTE: '$325'}, {events: ['drop']} ], messenger: 'telegram' },
                ]);
                */
            });
        });
    });

    it('View all filters', function() {
        let promises = Array.apply(null, {length: 2}).map((a, i) => {
            payload.format = formats[i % 2];
            let messenger = messengers[ i % 2];
            return command(payload, messenger);
        });

        return Promise.all(promises)
        .then(messages => {
            expect(messages).to.satisfy(arr => {
                return arr.every((message, i) => {
                    let c = commandChars[i];
                    expect(message).to.have.key('text');
                    expect(message).to.have.property('text', `Your Subscription Filters\nYou will only receive notifications that pass at least one of your filters\nType ${c}filter delete <number> to delete a filter\n\n1. All sales, and bids of $325 and above on Zora\n2. All drops`);

                    return true;
                });
            });
            return subdao.fetchSubscription(chatID)
        }).then(res => {
            expect(res).to.have.lengthOf(2);
            expect(res).to.have.deep.members([
                { chatID, filters: [ {events: ['sale', 'bid'], txPriceGTE: '$325', platforms: ['zora']}, {events: ['drop']} ], messenger: 'twitter' },
                { chatID, filters: [ {events: ['sale', 'bid'], txPriceGTE: '$325', platforms: ['zora']}, {events: ['drop']} ], messenger: 'telegram' },
            ]);
        });
    });
});

