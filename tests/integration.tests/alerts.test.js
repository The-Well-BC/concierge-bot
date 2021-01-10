const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const bot = require('../../components/bot');
const alertsModel = require('../../components/alerts.model');
const subdao = require('../../components/daos/subscription.dao');

const sampleTelegramPayloads = require('../samplePayload.json');
const sampleTwitterPayloads = require('../twitterSamplePayload');

describe.only('Sending alerts', function() {
    before(() => {
        return subdao.addSubscription(sampleTelegramPayloads.chatID, 'telegram')
        .then(() => {
            subdao.addSubscription(sampleTwitterPayloads.chatID, 'twitter')
        });
    });

    it('Send alerts model', function() {
        return alertsModel.sendAlerts('1 day', 3)
        .then(res => {
            console.log('Sent Alerts', res);
            expect(res).to.all.have.property('ok', true);
            expect(res).to.all.have.property('result');
            expect(res).to.satisfy( arr => {
                assert.includeMembers(arr, [{ event:{type: 'message_create', message_create: {}} }]);
                return arr.every(item => {
                    assert.match(item.result.text, /(released\s.*on)|(bought\s.*on)/);

                    return true;
                });
            });
        });
    });
});
