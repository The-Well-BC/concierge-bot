const alerts = require('../../components/alerts');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;
const clone = require('rfdc')();

describe('Returns Alerts Message Object', function() {
    let resourcePayload = [
        {
            price: '$73.58',
            name: 'Unit—002',
            date: '2020-08-31T19:00:00.000Z',
            service: 'foundation',
            brand: 'postdigital',
            action: 'Buy',
            img: null
        }, {
            price: '$73.58',
            name: 'Unit—002',
            date: '2020-08-31T19:00:00.000Z',
            service: 'foundation',
            brand: 'postdigital',
            img: 'https://boon.com/boon.jpg',
            action: 'Sell'
        }, {
            price: '$73.58',
            name: 'Unit—002',
            date: '2020-08-31T19:00:00.000Z',
            service: 'foundation',
            brand: 'postdigital',
            img: 'https://boon.com/boon.jpg',
            action: 'Redeem'
        }, {
            price: '$80.53',
            minBid: '$66.55',
            name: 'Mystery Box X',
            date: '2020-11-01T19:42:45.000Z',
            service: 'foundation',
            brand: 'Neue Goods',
            status: 'Open',
            action: undefined,
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }, {
            price: '$80.53',
            minBid: '$60.5',
            name: 'Mystery Box X',
            date: '2020-11-01T19:37:30.000Z',
            service: 'foundation',
            brand: 'Neue Goods',
            status: 'Closed',
            action: undefined,
            img: 'https://images.ctfassets.net/9tp4nbs38ooy/4UmMq3wdsrhbRq8sK7YNbR/f0d1d4cf77dfe6ffdb1f1e63ef990360/Neuegoods_Box_006.jpg'
        }
    ]

    const chatids = [93892, 1345241, 45252]; 

    it('Check that all keys are present', function() {
        let alertMessage = [];
        alertMessage.push( ...alerts.alertMessage(chatids, resourcePayload[0]));
        alertMessage.push( ...alerts.alertMessage(chatids, resourcePayload[1]));

        expect(alertMessage).to.all.include.keys('chat_id', 'text', 'parse_mode');
    });

    it('Make sure parse mode is turned to Markup', function() {
        let alertMessage = [];
        alertMessage.push( ...alerts.alertMessage(chatids, resourcePayload[0]));
        alertMessage.push( ...alerts.alertMessage(chatids, resourcePayload[1]));

        expect(alertMessage).to.all.have.property('parse_mode', 'Markdown');
    });

    it('Check that text output is correct', function() {
        let alertMessage = [];
        alertMessage.push( alerts.alertMessage(chatids, resourcePayload[0]));
        alertMessage.push( alerts.alertMessage(chatids, resourcePayload[1]));
        alertMessage.push( alerts.alertMessage(chatids, resourcePayload[2]));

        expect(alertMessage[0]).to.all.have.property('text', 'Unit—002 was bought on August 31, 2020.\nIt is currently trading at $73.58\nBrand: postdigital\n\n_via: Foundation_');
        expect(alertMessage[1]).to.all.have.property('text', 'Unit—002 was sold on August 31, 2020.\nIt is currently trading at $73.58\nBrand: postdigital\n\n_via: Foundation_');
        expect(alertMessage[2]).to.all.have.property('text', 'Unit—002 was redeemed on August 31, 2020.\nIt is currently trading at $73.58\nBrand: postdigital\n\n_via: Foundation_');
    });

    describe('If action is not present, but status is, treat as bid', function() {
        it('Open bid', function() {
            let alertMessage =  alerts.alertMessage(chatids, resourcePayload[3]);
            expect(alertMessage).to.all.have.property('text', 'Mystery Box X opened on November 1, 2020 at a price of $80.53.\nIt is currently trading at $66.55.\nBrand: Neue Goods\n\n_via: Foundation_');
        });

        it('Closed bid, closedOn date is supplied', function() {
            let alertMessage =  alerts.alertMessage(chatids, resourcePayload[4]);
            expect(alertMessage).to.all.have.property('text', 'Mystery Box X closed on November 1, 2020 at a price of $80.53.\nBrand: Neue Goods\n\n_via: Foundation_');
        });

        it('Closed bid, closedOn date is not supplied', function() {
            let payload = clone(resourcePayload[4]);
            delete payload.closedOn;
            let alertMessage =  alerts.alertMessage(chatids, payload);
            expect(alertMessage).to.all.have.property('text', 'Mystery Box X closed on November 1, 2020 at a price of $80.53.\nBrand: Neue Goods\n\n_via: Foundation_');
        });
    });

    it('Check that chat ids are present', function() {
        let alertmessage = alerts.alertMessage(chatids, resourcePayload[0]);
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[0]);
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[1]);
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[2]);
    });

    it('When no image is supplied, check that property \'photo\' is NOT present', function() {
        let alertmessage = alerts.alertMessage(chatids, resourcePayload[0]);

        expect(alertmessage).to.all.not.have.key('photo');
    });

    it('When image is supplied, check that property \'photo\' IS present', function() {
        let alertmessage = alerts.alertMessage(chatids, resourcePayload[1]);

        expect(alertmessage).to.all.have.property('photo', 'https://boon.com/boon.jpg');
    });
});
