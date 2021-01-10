const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/daos/subscription.dao');

const links = require('../../config/links');

const samplePayloads = require('../twitterSamplePayload.js');

// describe.only('Twitter routes', function() {
describe.only('Twitter routes', function() {
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

    it.skip('Send start command', function() {
        const payload = clone(samplePayloads.commands.start);
        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.property('type', 'message_create');
            expect(res.body.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');

            expect(res.body.event.message_create.target.recipient_id).to.equal(payload.direct_message_events[0].message_create.sender_id);

            // Text
            expect(res.body.event.message_create.message_data).to.include.keys('text', 'quick_reply');
            expect(res.body.event.message_create.message_data.text).to.have.string('subscribe to all');
            expect(res.body.event.message_create.message_data.quick_reply.options).to.not.be.empty;
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        console.log('PAYLOAD DIRECT MESSAGE',payload.direct_message_events[0].message_create);
        const chatID = payload.direct_message_events[0].message_create.sender_id

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.property('type', 'message_create');
            expect(res.body.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');

            expect(res.body.event.message_create.target.recipient_id).to.equal(payload.direct_message_events[0].message_create.sender_id);
            expect(res.body.event.message_create.message_data.text).to.have.string("subscribed to", "You");
            return subdao.fetchSubscription(chatID)
            .then(res => {
                expect(res).to.have.lengthOf(1);
                expect(res[0]).to.containSubset({
                    chatID, filters: [], messenger: 'twitter'
                });
            });
        });
    });

    it('Subscribe user to one service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chatID = payload.direct_message_events[0].message_create.sender_id
        payload.direct_message_events[0].message_create.message_data.text = '!subscribe nifty';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.property('type', 'message_create');
            expect(res.body.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');

            expect(res.body.event.message_create.target.recipient_id).to.equal(payload.direct_message_events[0].message_create.sender_id);

            expect(res.body.event.message_create.message_data.text).to.have.string("Nifty Gateway", "You");
            return subdao.fetchSubscription(chatID)
            .then(res => {
                expect(res).to.eql([
                    { chatID, filters: [ {platforms:['nifty']} ], messenger: 'twitter'}
                ]);
            });
        });
    });

    it('Subscribe user to illegal service', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chatID = payload.direct_message_events[0].message_create.sender_id
        payload.direct_message_events[0].message_create.message_data.text = '!subscribe xora';

        return request(app).post(links.twitterWebhook).send(payload)
        .then(res => {
            expect(res.body).to.have.key('event');
            expect(res.body.event).to.have.property('type', 'message_create');
            expect(res.body.event).to.have.keys('type', 'id', 'created_timestamp', 'message_create');

            expect(res.body.event.message_create.target.recipient_id).to.equal(payload.direct_message_events[0].message_create.sender_id);

            expect(res.body.event.message_create.message_data.text).to.have.string("'xora'", 'fail');

            return subdao.fetchSubscription(chat_id)
            .then(res => {
                expect(res).to.eql([]);
            });
        });
    });
});
