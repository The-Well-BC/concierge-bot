const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/daos/subscription.dao');

const links = require('../../config/links');

const samplePayloads = require('../twitterSamplePayload.js');

describe('Twitter routes', function() {
    before(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('Twitter CRC validation #once', function() {
        this.timeout(3000);

        return request(app).get(links.twitterWebhook + '?crc_token=123456')
        .then(res => {
            expect(res.body).to.have.property('response_token').that.contains.string('sha256=');
        });
    });

    it('Send start command', function() {
    // it.only('Send start command', function() {
        const payload = clone(samplePayloads.commands.start);
        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.property('type', 'message_create');
            expect(res.body.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');

            expect(res.body.event.message_create.target.recipient_id).to.equal(payload.direct_message_events[0].message_create.sender_id);

            // Text
            expect(res.body.event.message_create.message_data).to.have.keys('text', 'quick_reply');
            expect(res.body.event.message_create.message_data.text).to.have.string('subscribe to all');
            expect(res.body.event.message_create.message_data.quick_reply.options).to.not.be.empty;
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        console.log('PAYLOAD DIRECT MESSAGE',payload.direct_message_events[0].message_create);
        const chat_id = payload.direct_message_events[0].message_create.sender_id

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.keys('chat_id', 'text', 'method');
            expect(res.body.event).to.have.property('method', 'sendMessage');

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

        const chat_id = payload.direct_message_events[0].message_create.sender_id
        payload.direct_message_events[0].message_create.message_data.text = '/subscribe zora';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.keys('chat_id', 'text', 'method');

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

        const chat_id = payload.direct_message_events[0].message_create.sender_id
        payload.direct_message_events[0].message_create.message_data.text = '/subscribe zora';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.keys('chat_id', 'text');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("fail");
            return subdao.fetchUserSubscriptions(chat_id)
            .then(res => {
                expect(res).to.eql([]);
            });
        });
    });
});
