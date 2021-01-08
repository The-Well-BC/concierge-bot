const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Event type', function() {
    it('Filter by event type', function() {
        let users = [
            { chatID: 1234, messenger: 'telegram', filters: [{events: ['drop']}] },
            { chatID: 5678, messenger: 'telegram', filters: [{events: ['listing']}] },
            { chatID: 9012, messenger: 'telegram', filters: [{events: ['sale','drop']}] }
        ];

        let events = [
            { name: 'Broken Broom', event: 'sale', creator: { name: 'Broomhead', } },
            { name: 'Broken Table', event: 'drop', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', event: 'listing', creator: { name: 'Von PlumeFeathers' } },
            { name: 'bronn', event: 'drop', creator: { name: 'Johann Du Beck', url: 'becker' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [9012] },
            { payload: events[1], chatIDs: [1234,9012] },
            { payload: events[2], chatIDs: [5678] },
            { payload: events[3], chatIDs: [1234,9012] }
        ]);
    });
});
