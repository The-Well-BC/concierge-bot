const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const bot = require('../../components/bot');
const alertsModel = require('../../components/alerts.model');
const subdao = require('../../components/daos/subscription.dao');

const sampleTelegramPayloads = require('../samplePayload.json');
const sampleTwitterPayloads = require('../twitterSamplePayload');

describe('Sending alerts', function() {
    this.timeout(30000);
    before(() => {
        return subdao.addSubscription(sampleTelegramPayloads.chatID, 'telegram')
        .then(() => {
            subdao.addSubscription(sampleTwitterPayloads.chatID, 'twitter')
        });
    });

    it('Send alerts for 1 day period', function() {
        let now = new Date();
        let startTime = new Date(new Date().setDate(now.getDate() - 1));

        return alertsModel.sendAlerts(startTime)
        .then(res => {
            expect(res).to.satisfy( arr => {
                let oneTwitter = arr.some(item => {
                    return item.event;
                });

                if(oneTwitter !== true) { 
                    assert.fail(
                        arr,
                        [{event: { type: 'message_create' }}],
                        'Missing Expected there to be at least one twitter message object.with property "event"'
                    );
                }

                let text;
                return arr.every(item => {
                    if(!item.event) {
                        assert.propertyVal(item, 'ok', true);
                        assert.property(item, 'result');
                        text = item.result.text;
                    } else {
                        assert.property(item, 'event');
                        text = item.event.message_create.message_data.text;
                    }

                    assert.match(text, /(released\s.*on)|(bought\s.*on)/);

                    return true;
                });
            });
        });
    });

    it('Send alerts for 5 minute period', function() {
        let now = new Date();
        let startTime = new Date(new Date().setMinutes(now.getMinutes() - 5));

        return alertsModel.sendAlerts(startTime)
        .then(res => {
            console.log('ARR', res);
            expect(res).to.satisfy( arr => {
                if(arr.length > 1) {
                    let oneTwitter = arr.some(item => {
                        return item.event && item.event.type === 'message_create';
                    });

                    assert(oneTwitter === true, 
                        'Expected there to be at least one message object with property "event"'
                    );
                }

                let text;
                return arr.every(item => {
                    if(!item.event) {
                        assert.propertyVal(item, 'ok', true);
                        assert.property(item, 'result');
                        text = item.result.text;
                    } else {
                        assert.property(item, 'event');
                        text = item.event.message_create.message_data.text;
                    }

                    assert.match(text, /(released\s.*on)|(bought\s.*on)/);

                    return true;
                });
            });
        });
    });
});
