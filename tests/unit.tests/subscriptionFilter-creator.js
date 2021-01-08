const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Creator name', function() {
    it('Filter by creator names', function() {
        let users = [ {
                chatID: 1234, messenger: 'telegram',
                filters: [ { creators: ['Johann Du Beck', 'Von PlumeFeathers'] }, ]
            }, {
                chatID: 5678, messenger: 'telegram',
                filters: [ { creators: ['Von PlumeFeathers'] } ]
        }];

        let events = [
            { name: 'bronn', creator: { name: 'Johann Du Beck', url: 'becker' } },
            { name: 'Broken Broom', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', creator: { name: 'Von PlumeFeathers' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [ 1234 ] },
            { payload: events[2], chatIDs: [1234,5678] }
        ]);
    });

    it('Filter when one chat has subscribed to all creators', function() {
        let users = [
            { chatID: 1234, filters: [ {creators: ['John Du Beck', 'Von PlumeFeathers']} ], messenger: 'telegram'},
            { chatID: 5678, filters: [ {creators: ['Von PlumeFeathers']} ], messenger: 'telegram'},
            { chatID: 9012, filters: [ {event: 'drop'} ], messenger: 'telegram'}
        ];

        let events = [
            { name: 'bronn', creator: { name: 'John Du Beck', url: 'becker' } },
            { name: 'Broken Broom', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', creator: { name: 'Von PlumeFeathers' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [ 1234, 9012 ] },
            { payload: events[1], chatIDs: [9012] },
            { payload: events[2], chatIDs: [1234,5678, 9012] }
        ]);
    });
});
