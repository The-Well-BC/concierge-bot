const dao = require('../../components/subscription.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

describe('Save Subscriptions', function() {
    it('Save service subscriptions', function() {
        const chatid = 123456;
        const service = 'foundation';

        return dao.addServiceSubscription(chatid, service)
        .then(res => {
            return dao.fetchServiceSubscription(chatid, service);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, service });
        });
    });

    it('Test conflict service subscriptions', function() {
        const chatid = 123456;
        const service = 'foundation';

        return dao.addServiceSubscription(chatid, service)
        .then(res => {
            return expect( dao.addServiceSubscription(chatid, service) ).to.not.be.rejected;
        })
        .then(res => {
            return dao.fetchServiceSubscription(chatid, service);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, service });
        });
    });
});
