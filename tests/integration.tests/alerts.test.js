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
            console.log('RSSS', res);
            return expect(res).to.all.have.property('ok', true);
        });
    });
});
