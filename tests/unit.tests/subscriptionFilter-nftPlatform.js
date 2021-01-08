const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Event type', function() {
    it('Filter by NFT platform', function() {
        let users = [
            { chatID: 1234, messenger: 'telegram', filters: [{platforms: ['foundation','zora']}] },
            { chatID: 5678, messenger: 'telegram', filters: [{platforms: ['nifty']}] },
            { chatID: 9012, messenger: 'telegram', filters: [{platforms: ['superrare','zora']}] }
        ];

        let events = [
            { name: 'Broken Broom', platform: 'superrare', creator: { name: 'Broomhead', } },
            { name: 'Broken Table', platform: 'nifty', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', platform: 'zora', creator: { name: 'Von PlumeFeathers' } },
            { name: 'bronn', platform: 'foundation', creator: { name: 'Johann Du Beck', url: 'becker' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [9012] },
            { payload: events[1], chatIDs: [5678] },
            { payload: events[2], chatIDs: [1234,9012] },
            { payload: events[3], chatIDs: [1234] }
        ]);
    });
});
