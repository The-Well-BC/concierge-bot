const dao = require('../../components/daos/subscription.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

describe('Saving Subscriptions', function() {
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Save subscription to all nft platforms', function() {
        const chatid = 123456;
        const messenger = 'twitter';

        return dao.addServiceSubscription(chatid, null, messenger, true)
        .then(res => {
            return dao.fetchServiceSubscription(chatid);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.eql({ chat_id: chatid, service: [], messenger, all: true });
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
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.eql({ chat_id: chatid, service: [ service ], messenger, all: false });
        });
    });

    it('Add nft platform subscription', function() {
        const chatid = 123486;
        const messenger = 'twitter';

        return dao.addServiceSubscription(chatid, 'superrare', messenger, false)
        .then(res => {
            return dao.addServiceSubscription(chatid, 'xoa', messenger, false)
        }).then(res => {
            return dao.fetchServiceSubscription(chatid, 'superrare');
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.deep.eql({ chat_id: chatid, service: [ 'xoa', 'superrare' ], messenger, all: false });
        });
    });

    it('Save subscription to multiple nft platform', function() {
        const chatid = 123486;
        const service = ['fondation', 'zora', 'nifty'];
        const messenger = 'twitter';

        return dao.addServiceSubscription(chatid, service, messenger, false)
        .then(res => {
            return dao.fetchServiceSubscription(chatid);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.eql({ chat_id: chatid, service, messenger, all: false });
        });
    });

    it('Test conflict service subscriptions', function() {
        const chatid = 103456;
        const service = 'fondue_mountain';
        const messenger = 'discord';

        return dao.addServiceSubscription(chatid, service, messenger, false)
        .then(res => {
            return expect( dao.addServiceSubscription(chatid, service, messenger, false) ).to.not.be.rejected;
        })
        .then(res => {
            return dao.fetchServiceSubscription(chatid, service);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.eql({ chat_id: chatid, service: [service], messenger, all: false });
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
    let item = 'fudo';
    let service = 'zora';

    before(() => {
        return dao.addServiceSubscription(chatids[0], service, 'twitter', false)
        .then(() => dao.addServiceSubscription(chatids[1], service, 'telegram', false))
        .then(() => dao.addServiceSubscription(chatids[2], service, 'discord', false))
        .then(() => dao.addItemSubscription(chatids[0], item, 'telegram'))
        .then(() => dao.addItemSubscription(chatids[1], item, 'telegram'))
        .then(() => dao.addItemSubscription(chatids[4], 'taekwondo', 'discord'))
        .then(() => dao.addItemSubscription(chatids[3], 'moon', 'twitter'))
        .then(() => dao.addServiceSubscription(1234, ['zora', 'xoa'], 'discord', false))
        .then(() => dao.addServiceSubscription(5678, 'xoa', 'twitter', false))
        .then(() => dao.addServiceSubscription(789, ['foundation', 'xoa', 'nifty'], 'discord', false));
    });

    it('Fetch ALL subscriptions to a particular service', function() {
        return dao.fetchServiceSubscription(null, 'xoa')
        .then(res => {
            expect(res).to.have.lengthOf(3);
            expect(res).to.have.deep.members([
                { all: false, chat_id: 1234, service: ['zora', 'xoa'], messenger: 'discord' },
                { all: false, chat_id: 5678, service: ['xoa'], messenger: 'twitter' },
                { all: false, chat_id: 789, service: ['foundation', 'xoa', 'nifty'], messenger: 'discord' }

            ]);
        });
    });

    it('Fetch all subscriptions to an item',function() {
        return dao.fetchItemSubscriptions(item)
        .then(res => {
            expect(res).to.have.deep.members([
                { chat_id: chatids[0], item, messenger: 'telegram' },
                { chat_id: chatids[1], item, messenger: 'telegram'}
            ]);
        });
    });
});
