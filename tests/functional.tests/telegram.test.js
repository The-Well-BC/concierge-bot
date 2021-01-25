const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/daos/subscription.dao');

const links = require('../../config/links');

const samplePayloads = require('../samplePayload.json');

describe('Telegram routes', function() {
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Send start command', function() {
        const payload = clone(samplePayloads.commands.start);

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'reply_markup', 'method', 'parse_mode');
            expect(res.body).to.have.property('method', 'sendMessage');
            expect(res.body.chat_id).to.equal(samplePayloads.chatID);
            expect(res.body.text).to.have.string("Hello " + payload.message.chat.first_name);
            expect(res.body.reply_markup).to.have.property('keyboard').that.is.an('array'). that.is.not.empty;
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chatID = "641574672";

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');
            expect(res.body).to.have.property('method', 'sendMessage');

            expect(res.body.chat_id).to.equal(samplePayloads.chatID);
            // expect(res.body.text).to.have.string("subscribed to", "You");
            return subdao.fetchSubscription(chatID)
            .then(res => {
                expect(res).to.have.lengthOf(1);
                expect(res[0]).to.containSubset({
                    chatID, filters: [], messenger: 'telegram'
                });
            });
        });
    });

    it('Subscribe user to one platform', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chatID = '641574672';
        payload.message.text = '/subscribe nifty';

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');

            expect(res.body.chat_id).to.equal(chatID);
            expect(res.body.text).to.have.string('Nifty Gateway');
            return subdao.fetchSubscription(chatID)
            .then(res => {
                expect(res).to.have.lengthOf(1);
                expect(res[0]).to.containSubset({
                    chatID: "641574672", filters: [ {platforms: [ 'nifty']} ],
                    messenger: 'telegram',
                });
            });
        });
    });

    it('Unknown command', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = samplePayloads.chatID;
        payload.message.text = '!subscribe xora';

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.equal('Command not recognized. Type in help to see what commands are available');
            return subdao.fetchSubscription(chat_id)
            .then(res => {
                expect(res).to.eql([]);
            });
        });
    });
});
