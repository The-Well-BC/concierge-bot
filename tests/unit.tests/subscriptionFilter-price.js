const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Transaction Price and NFT Price:', function() {
    it('Filter by NFT price: USD', function() {
        let chats = [
            { chatID: 1234, filters: [ {priceGT: '$1000'} ] , messenger: 'telegram'},
            { chatID: 5678, filters: [ {priceGTE: '$1000'} ] , messenger: 'telegram'},
            { chatID: 9012, filters: [ {priceLT: '$400'} ], messenger: 'telegram'},
            { chatID: 3456, filters: [ {priceLTE: '$400'} ], messenger: 'telegram'}
        ];

        let events = [
            { name: 'bronn', price: '$1,024.22' },
            { name: 'Broken Broom', price: '$1,000' },
            { name: 'Chicken Boo', price: '$228.21' },
            { name: 'Old fan', price: '$400' }
        ];

        let sortedEvents = subscriptionFilter(events, chats);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234, 5678] },
            { payload: events[1], chatIDs: [5678] },
            { payload: events[2], chatIDs: [9012, 3456] },
            { payload: events[3], chatIDs: [3456] }
        ]);
    });

    it.skip('Filter by NFT price: ETH', function() {
        let chats = [
            { chatID: 1234, filters: [ {priceGT: '1000eth'} ] , messenger: 'telegram'},
            { chatID: 5678, filters: [ {priceGTE: '$1000 eth'} ] , messenger: 'telegram'},
            { chatID: 9012, filters: [ {priceLT: '$400ETH'} ], messenger: 'telegram'},
            { chatID: 3456, filters: [ {priceLTE: '$400 ETH'} ], messenger: 'telegram'}
        ];

        let events = [
            { name: 'bronn', price: '$1,024.22' },
            { name: 'Broken Broom', price: '$1,000' },
            { name: 'Chicken Boo', price: '$228.21' },
            { name: 'Old fan', price: '$400' }
        ];

        let sortedEvents = subscriptionFilter(events, chats);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234, 5678] },
            { payload: events[1], chatIDs: [5678] },
            { payload: events[2], chatIDs: [9012, 3456] },
            { payload: events[3], chatIDs: [3456] }
        ]);
    });

    it('Filter by event transaction price: USD', function() {
        let chats = [
            { chatID: 1234, filters: [ {txPriceGT: '$1000'} ] , messenger: 'telegram'},
            { chatID: 5678, filters: [ {txPriceGTE: '$1000'} ] , messenger: 'telegram'},
            { chatID: 9012, filters: [ {txPriceLT: '$400'} ], messenger: 'telegram'},
            { chatID: 3456, filters: [ {txPriceLTE: '$400'} ], messenger: 'telegram'}
        ];

        let events = [
            { name: 'bronn', transaction: { price: '$1,024.22' } },
            { name: 'Broken Broom', transaction: {price: '$1,000' } },
            { name: 'Chicken Boo', transaction: { price: '$228.21' }},
            { name: 'Old fan', transaction: {price: '$400' }}
        ];

        let sortedEvents = subscriptionFilter(events, chats);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234, 5678] },
            { payload: events[1], chatIDs: [5678] },
            { payload: events[2], chatIDs: [9012, 3456] },
            { payload: events[3], chatIDs: [3456] }
        ]);
    });
});
