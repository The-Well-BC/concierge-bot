const dao = require('../../components/daos/subscription.dao');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const expect = chai.expect;

const teardown = require('../teardown');

describe('Saving Subscriptions', function() {
    beforeEach(() => teardown());

    it('Add subscription', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter = { platforms: ['zora', 'nifty'] };

        return dao.addSubscription(chatid, messenger, filter)
        .then(res => {
            return dao.fetchSubscription(chatid);
        }).then(res => {
            expect(res).to.have.deep.eql([
                { chatID: chatid, filters: [filter], messenger}
            ]);
        });
    });

    it('Delete subscription', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter = { platforms: ['zora', 'nifty'] };

        return dao.addSubscription(chatid, messenger, filter)
        .then(res => dao.deleteSubscription(chatid, messenger))
        .then(() => dao.fetchSubscription(chatid, messenger))
        .then(res => {
            expect(res).to.be.empty;
        });
    });

    it('Add additional filter to existing subscription', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter1 = { platforms: ['zora', 'nifty'] };
        const filter2 = { creators: ['Tuna Thurpe', 'Munachi'] };

        return dao.addSubscription(chatid, messenger, filter1)
        .then(res => {
            return dao.addSubscription(chatid, messenger, filter2)
        }) .then(res => {
            return dao.fetchSubscription(chatid);
        }).then(res => {
            expect(res).to.have.deep.members([
                {chatID: chatid, filters: [filter1,filter2], messenger}
            ]);
        });
    });

    it('Update Filter', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter1 = { platforms: ['zora', 'nifty'] };
        const filter2 = { creators: ['Tuna Thurpe', 'Munachi'] };
        const filter2a = { creators: ['Tuna Thurp', 'Munachi', 'Osina']};
        const filter3 = { txPriceGt: '$500' };
        const filter4 = { priceGt: '$500' };

        return dao.addSubscription(chatid, messenger, filter1)
        .then(res => dao.addSubscription(chatid, messenger, filter2))
        .then(res => dao.addSubscription(chatid, messenger, filter3))
        .then(res => dao.addSubscription(chatid, messenger, filter4))
        .then(res => dao.updateFilter(chatid, messenger, 2, filter2a))
        .then(res => {
            return dao.fetchSubscription(chatid);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.deep.eql({ chatID: chatid, filters: [ filter1,filter2a,filter3,filter4 ], messenger});
        });
    });

    it('Delete Filter', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter1 = { platforms: ['zora', 'nifty'] };
        const filter2 = { creators: ['Tuna Thurpe', 'Munachi'] };
        const filter3 = { creators: ['Tuna Thurpe', 'Munachi', 'Osina']};
        const filter4 = { priceGT: '$123.45'};

        return dao.addSubscription(chatid, messenger, filter1)
        .then(res => dao.addSubscription(chatid, messenger, filter2))
        .then(res => dao.addSubscription(chatid, messenger, filter3))
        .then(res => dao.addSubscription(chatid, messenger, filter4))
        .then(res => {
            return dao.deleteFilter(chatid, messenger, 2);
        }).then(res => {
            return dao.fetchSubscription(chatid);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.deep.eql({ chatID: chatid, filters: [filter1, filter3, filter4], messenger});
        });
    });

    it('Delete all filters', function() {
        const chatid = "123456";
        const messenger = 'twitter';
        const filter1 = { platforms: ['zora', 'nifty'] };
        const filter2 = { creators: ['Tuna Thurpe', 'Munachi'] };
        const filter3 = { creators: ['Tuna Thurpe', 'Munachi', 'Osina']};
        const filter4 = { priceGT: '$123.45'};

        return dao.addSubscription(chatid, messenger, filter1)
        .then(res => dao.addSubscription(chatid, messenger, filter2))
        .then(res => dao.addSubscription(chatid, messenger, filter3))
        .then(res => dao.addSubscription(chatid, messenger, filter4))
        .then(res => {
            return dao.deleteAllFilters(chatid, messenger);
        }).then(res => {
            return dao.fetchSubscription(chatid);
        }).then(res => {
            expect(res).to.have.lengthOf(1);
            expect(res[0]).to.deep.eql({ chatID: chatid, filters: [], messenger});
        });
    });
});

describe('Fetching subscriptions', function() {
    let chatids = ["325233", "897289", "690324123", "129292", "3898419", "700123"];
    let item = 'fudo';
    let service = 'zora';

    before(() => {
        return teardown()
        .then(() => dao.addSubscription(chatids[0],  'twitter', { platforms: ['zora']}))
        .then(() => dao.addSubscription(chatids[1], 'telegram', {platforms:['foundation']}))
        .then(() => dao.addSubscription(chatids[2],  'discord', {platforms: ['superrare']}))
        .then(() => dao.addSubscription(1234, 'discord', {platforms: ['zora', 'xoa']}))
        .then(() => dao.addSubscription(789, 'discord', {platforms: ['foundation', 'xoa', 'nifty']}));
    });

    it('Fetch ALL subscriptions for a messenger', function() {
        return dao.fetchSubscription(null, 'discord')
        .then(res => {
            expect(res).to.have.lengthOf(3);
            expect(res).to.have.deep.members([
                { chatID: chatids[2], filters: [{platforms: ['superrare']}], messenger: 'discord' },
                { chatID: "1234", filters: [{platforms: ['zora','xoa']}], messenger: 'discord' },
                { chatID: "789", filters: [{platforms:['foundation', 'xoa', 'nifty']}], messenger: 'discord' }
            ]);
        });
    });
});
