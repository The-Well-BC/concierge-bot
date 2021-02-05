const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Filter messengers', function() {
    it('Multiple messengers', function() {
        let users = [ {
                chatID: 1234, messenger: 'telegram',
            }, {
                chatID: 5678, messenger: 'twitter',
        }];

        let events = [
            { name: 'bronn', event: 'sale', transaction: { price: '$5231' }, creator: { name: 'Johann Du Beck', url: 'becker' } },
            { name: 'Broken Broom', event: 'bid', creator: { name: 'Broomhead', } },
            { name: 'Stable Broom', price: '$1001', event: 'drop', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', transaction: { price: '$231' }, event: 'sale', creator: { name: 'Von PlumeFeathers' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.deep.eql([
            { payload: events[0], chatIDs: [1234,5678] },
            { payload: events[2], chatIDs: [1234,5678] }
        ]);
    });
});

