const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();
const subdao = require('../../components/subscription.dao');

const samplePayloads = require('../samplePayload.json');

describe('User subscribes to foundation', function() {
    before(() => {
        const teardown = require('../teardown');
        return teardown();
    });

    it('First run', function() {
        const payload = clone(samplePayloads.commands.start);
        return request(app).post('/webhook/telegram/secret').send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'reply_markup');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("Hello " + payload.message.chat.first_name);
            expect(res.body.reply_markup.keyboard[0].length).to.be.greaterThan(1);
        });
    });

    it('Subscribe user to all services', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        const chat_id = payload.message.chat.id;

        return request(app).post('/webhook/telegram/secret').send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text');

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

        return request(app).post('/webhook/telegram/secret').send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text');

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

        return request(app).post('/webhook/telegram/secret').send(payload)
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
