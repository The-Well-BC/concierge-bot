const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Combined Filters:', function() {
    it('Combine multiple filters', function() {
        let chats = [{
                chatID: 1234, messenger: 'telegram',
                filters: [
                    {priceGT: '$1000'},
                    {platforms: ['foundation','zora']}
                ]
            }, {
                chatID: 3456, messenger: 'telegram',
                filters: [
                    {creators: ['De VanPlum', 'Old Monkeys']},
                    {events: ['listings'], txPriceLT: '$800'},
                    {events: ['sale', 'bid'], txPriceLT: '$500', platforms: ['nifty']}
                ]
        }];

        let events = [{
                name: 'bronn', creator: {name:'De VanPlum'}, price: '$1,024.22', platform: 'zora',
                event: 'bid', transaction: { price: '$1100'},
            }, {
                name: 'Broken Broom', platform: 'foundation', price: '$1,000',
                event: 'sale', transaction: {price: '$400'}, creator: {name: 'Bashed Drum'}
            }, {
                name: 'Chicken Boo', platform: 'nifty', price: '$228.21', creator: {name:'Old Monkeys'},
                event: 'drop'
            }, {
                name: 'Old fan', platform: 'superrare', price: '$600', creator: {name:'Fregulon'},
                event: 'listing'
        }];

        let sortedEvents = subscriptionFilter(events, chats);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234,3456] },
            { payload: events[1], chatIDs: [1234] },
            { payload: events[2], chatIDs: [3456] }
        ]);
    });
});
