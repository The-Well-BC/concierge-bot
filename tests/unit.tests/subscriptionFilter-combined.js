const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Combined Filters:', function() {
    it('Combine multiple filters', function() {
        let chats = [{
                chatID: 1234, messenger: 'telegram',
                filters: [ {priceGT: '$1000', platforms: ['foundation']} ]
            }, {
                chatID: 5678, messenger: 'telegram',
                filters: [ {platforms: ['zora'], creators: ['De VanPlum'] } ]
            }, {
                chatID: 9012, messenger: 'telegram',
                filters: [ {events: ['drop'], creators: ['Old Monkeys','Fregulon']} ]
            }, {
                chatID: 3456, messenger: 'telegram',
                filters: [ {events: ['sale', 'bid'], txPriceGT: '$100'} ]
        }];

        let events = [{
                name: 'bronn', creator: {name:'De VanPlum'}, price: '$1,024.22', platform: 'zora',
                event: 'bid', transaction: { price: '$1100'},
            }, {
                name: 'Broken Broom', platform: 'foundation', price: '$1,000',
                event: 'sale', transaction: {price: '$1001'}, creator: {name: 'Bashed Drum'}
            }, {
                name: 'Chicken Boo', platform: 'nifty', price: '$228.21', creator: {name:'Old Monkeys'},
                event: 'drop'
            }, {
                name: 'Old fan', platform: 'superrare', price: '$400', creator: {name:'Fregulon'},
                event: 'listing'
        }];

        let sortedEvents = subscriptionFilter(events, chats);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [5678,3456] },
            { payload: events[1], chatIDs: [3456] },
            { payload: events[2], chatIDs: [9012] }
        ]);
    });
});
