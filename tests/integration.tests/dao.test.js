const dao = require('../../components/daos/subscription.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

describe('Saving Subscriptions', function() {
    it('Save subscription to all nft platforms', function() {
        const chatid = 123456;
        const messenger = 'twitter';

        return dao.addServiceSubscription(chatid, null, messenger, true)
        .then(res => {
            return dao.fetchServiceSubscription(chatid);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, service: [], messenger, all: true });
        });
    });

    it('Save subscription to single nft platform', function() {
        const chatid = 123486;
        const service = 'foundation';
        const messenger = 'twitter';

        return dao.addServiceSubscription(chatid, service, messenger, false)
        .then(res => {
            return dao.fetchServiceSubscription(chatid, service);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, service: [ service ], messenger, all: false });
        });
    });

    it('Test conflict service subscriptions', function() {
        const chatid = 103456;
        const service = 'foundation';
        const messenger = 'discord';

        return dao.addServiceSubscription(chatid, service, messenger, false)
        .then(res => {
            return expect( dao.addServiceSubscription(chatid, service, messenger, false) ).to.not.be.rejected;
        })
        .then(res => {
            return dao.fetchServiceSubscription(chatid, service);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, service: [service], messenger, all: false });
        });
    });

    it('Save item subscriptions', function() {
        const chatid = 123456;
        const item = 'moan';
        const messenger = 'facebook';

        return dao.addItemSubscription(chatid, item, messenger)
        .then(res => {
            return dao.fetchItemSubscription(chatid, item);
        }).then(res => {
            expect(res).to.eql({ chat_id: chatid, item, messenger });
        });
    });
});

describe('Fetching subscriptions', function() {
    let chatids = [325233, 897289, 690324123, 129292, 3898419, 700123];
    let item = 'xoa';
    let service = 'zora';

    before(() => {
        return dao.addServiceSubscription(chatids[0], service)
        .then(() => dao.addServiceSubscription(chatids[1], service))
        .then(() => dao.addServiceSubscription(chatids[2], service))
        .then(() => dao.addServiceSubscription(chatids[5], 'foundation'))
        .then(() => dao.addItemSubscription(chatids[0], item))
        .then(() => dao.addItemSubscription(chatids[1], item))
        .then(() => dao.addItemSubscription(chatids[4], item))
        .then(() => dao.addItemSubscription(chatids[3], 'moon'));
    });

    it('Fetch All subscriptions to a particular service', function() {
        return dao.fetchServiceSubscriptions(service)
        .then(res => {
            expect(res).to.have.deep.members([
                { chat_id: chatids[0], service },
                { chat_id: chatids[1], service },
                { chat_id: chatids[2], service }
            ]);
        });
    });

    it('Fetch all subscriptions to an item',function() {
        return dao.fetchItemSubscriptions(item)
        .then(res => {
            expect(res).to.have.deep.members([
                { chat_id: chatids[0], item },
                { chat_id: chatids[1], item },
                { chat_id: chatids[4], item }
            ]);
        });
    });

    it('Fetches subscribers to an item an a service', function() {
        return dao.fetchServiceItemSubs({ service, item })
        .then(res => {
            expect(res).to.have.deep.members([
                chatids[0], chatids[1], chatids[2], chatids[4]

            ]);
        });
    });
});
