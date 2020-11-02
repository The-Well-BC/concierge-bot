const chai = require('chai');

const bot = require('../../components/bot');

const expect = chai.expect;
const alertsModel = require('../../components/alerts.model');

const samplePayloads = require('../samplePayload.json');

describe('Sending alerts', function() {
    before(() => {
        console.log('ALERTS BEFOERLL');
        return bot.receiveMessage(samplePayloads.commands.subscribe);
    });

    it('Send alerts', function() {
        return alertsModel.sendAlerts()
        .then(res => {
            console.log('RSSS', res);
            return expect(res).to.be.an('object');
        });
    });
});
