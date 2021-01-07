const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/daos/subscription.dao');

const links = require('../../config/links');

const samplePayloads = require('../twitterSamplePayload.js');

describe.only('Twitter: Test routes', function() {
    before(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it.only('Twitter CRC validation', function() {
        this.timeout(3000);

        return request(app).get(links.twitterWebhook + '?crc_token=123456')
        .then(res => {
            expect(res.body).to.have.property('response_token').that.contains.string('sha256=');
        });
    });

    it.only('Send start command', function() {
        const payload = clone(samplePayloads.commands.start);
        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.property('status', true);

            /*
            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("Hello " + payload.message.chat.first_name);
            expect(res.body.reply_markup.keyboard[0].length).to.be.greaterThan(1);
            */
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method');
            expect(res.body).to.have.property('method', 'sendMessage');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("subscribed to", "You");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.eql([
                    { chat_id, service: 'foundation'},
                    { chat_id, service: 'zora'}
                ]);
            });
        });
    });

    it('Subscribe user to one service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;
        payload.message.text = '/subscribe zora';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'method');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("subscribed to", "You");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.eql([
                    { chat_id, service: 'zora'}
                ]);
            });
        });
    });

    it('Subscribe user to illegal service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;
        payload.message.text = '/subscribe xora';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("fail");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.eql([]);
            });
        });
    });
});
