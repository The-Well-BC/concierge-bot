const expect = require('chai').expect;
const subscriptionFilter = require('../../components/subscriptionFilter');

describe('Test Subscription filter: Default filters', function() {
    it('Telegram default filter', function() {
        let users = [ {
                chatID: 1234, messenger: 'telegram',
            }, {
                chatID: 5678, messenger: 'telegram',
        }];

        let events = [
            { name: 'bronn', event: 'sale', creator: { name: 'Johann Du Beck', url: 'becker' } },
            { name: 'Broken Broom', event: 'bid', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', event: 'listing', creator: { name: 'Von PlumeFeathers' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234,5678] }
        ]);
    });

    it('Twitter default filter', function() {
        let users = [ {
                chatID: 1234, messenger: 'twitter',
            }, {
                chatID: 5678, messenger: 'twitter',
        }];

        let events = [
            { name: 'bronn', transaction: { price: '$562' }, creator: { name: 'Johann Du Beck', url: 'becker' } },
            { name: 'Broken Broom', transaction: { price: '$25'}, price: '$25.2', creator: { name: 'Broomhead', } },
            { name: 'Chicken Boo', transaction: { price: '$500.19'}, creator: { name: 'Von PlumeFeathers' } }
        ];

        let sortedEvents = subscriptionFilter(events, users);

        expect(sortedEvents).to.have.deep.members([
            { payload: events[0], chatIDs: [1234,5678] },
            { payload: events[2], chatIDs: [1234,5678] }
        ]);
    });

    it('Non-existent messenger', function() {
        let users = [{chatID:5678, messenger:'fzakaf'}];

        let events = [
            { name: 'Chicken Boo', transaction: { price: '$500.19'}, creator: { name: 'Von PlumeFeathers' } }
        ];

        expect(() => subscriptionFilter(events, users)).to.throw;
    });
});

