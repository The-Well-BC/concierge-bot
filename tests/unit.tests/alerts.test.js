const alerts = require('../../components/alerts');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;

describe('Returns Alerts Message Object', function() {
    it('When no image is supplied', function() {
        const chatids = [93892, 1345241, 45252];
        const resourcePayload = {
            price: '$73.58',
            name: 'Unit—002',
            date: '2020-08-31T19:00:00.000Z',
            service: 'foundation',
            brand: 'postdigital',
            img: null
        };

        let alertmessage = alerts.alertMessage(chatids, resourcePayload);

        expect(alertmessage).to.all.have.keys('chat_id', 'text');
        expect(alertmessage).to.all.not.have.key('photo');
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[0]);
        expect(alertmessage[0]).to.have.property('text', 'Unit—002 dropped on August 31, 2020.\nIt is currently trading at $73.58\nBrand: postdigital\n\n_via Foundation_');
    });

    it('When image is supplied', function() {
        const chatids = [93892, 1345241, 45252];
        const resourcePayload = {
            price: '$73.58',
            name: 'Unit—002',
            date: '2020-08-31T19:00:00.000Z',
            service: 'foundation',
            brand: 'postdigital',
            img: 'https://boon.com/boon.jpg'
        };

        let alertmessage = alerts.alertMessage(chatids, resourcePayload);

        expect(alertmessage).to.all.have.keys('chat_id', 'text', 'photo');
        expect(alertmessage).to.all.have.property('photo', 'https://boon.com/boon.jpg');
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[0]);
        expect(alertmessage[0]).to.have.property('text', 'Unit—002 dropped on August 31, 2020.\nIt is currently trading at $73.58\nBrand: postdigital\n\n_via Foundation_');
    });
});
