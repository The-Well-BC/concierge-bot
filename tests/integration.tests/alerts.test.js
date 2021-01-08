const chai = require('chai');
const nftFn = require('../../components/nftTradingPlatforms');

const bot = require('../../components/bot');

const expect = chai.expect;
const alertsModel = require('../../components/alerts.model');

const samplePayloads = require('../samplePayload.json');

describe('Sending alerts', function() {
    before(() => {
        return bot.receiveMessage(samplePayloads.commands.subscribe, 'telegram');
    });

    it('Send alerts model', function() {
        return alertsModel.sendAlerts('1 day', 3)
        .then(res => {
            console.log('Sent Alerts', res);
            expect(res).to.all.have.property('ok', true);
            expect(res).to.all.have.property('text');
            expect(res).to.all.satisfy( item => {
                return (/released\s.*on/.test(item.result.text))
                            ||
                (/placed a bid/.test(item.result.text))
            });
        });
    });
});
