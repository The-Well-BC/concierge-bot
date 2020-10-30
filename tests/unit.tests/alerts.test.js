const alerts = require('../../components/alerts');
const chai = require('chai');
chai.use( require('chai-things') );
const expect = chai.expect;

describe('Send Alerts', function() {
    it('Returns alert object', function() {
        const chatids = [93892, 1345241, 45252];
        const resourcePayload = {
            price: 19.21,
            name: 'Boon',
            date: new Date()
        }
        let alertmessage = alerts.alertMessage(chatids, resourcePayload);

        expect(alertmessage).to.all.have.keys('chat_id', 'text');
        expect(alertmessage).to.include.something.with.property('chat_id', chatids[0]);
    });
});
