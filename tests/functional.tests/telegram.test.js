const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/daos/subscription.dao');

const links = require('../../config/links');

const samplePayloads = require('../samplePayload.json');

describe('Telegram', function() {
    beforeEach(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Send start command', function() {
        const payload = clone(samplePayloads.commands.start);
        console.log('PAYLOAD', payload);

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'reply_markup', 'method', 'parse_mode');
            expect(res.body).to.have.property('method', 'sendMessage');
            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("Hello " + payload.message.chat.first_name);
            expect(res.body.reply_markup).to.have.property('keyboard').that.is.an('array');
            // expect(res.body.reply_markup.keyboard[0].length).to.be.greaterThan(1);
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');
            expect(res.body).to.have.property('method', 'sendMessage');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            // expect(res.body.text).to.have.string("subscribed to", "You");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.have.lengthOf(1);
                expect(res[0]).to.containSubset({
                    chat_id, service: [], all_: true, messenger: 'telegram'
                });
            });
        });
    });

    it('Subscribe user to one service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;
        payload.message.text = '/subscribe zora';

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("subscribed to", "You");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.have.lengthOf(1);
                expect(res[0]).to.containSubset({
                    chat_id, service: [ 'zora' ],
                    messenger: 'telegram',
                    all_: false
                });
            });
        });
    });

    it('Subscribe user to illegal service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;
        payload.message.text = '/subscribe xora';

        return request(app).post(links.telegramWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method', 'parse_mode');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.equal('The NFT platform "xora" is currently not available. Try /browse to see what platforms you can subscribe to');
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.eql([]);
            });
        });
    });
});
