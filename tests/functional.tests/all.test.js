const chai = require('chai');
const expect = chai.expect;

const app = require('../../app');
const request = require('supertest');
const clone = require('rfdc')();

const samplePayloads = require('../samplePayload.json');

describe('User subscribes to foundation', function() {
    it('First run', function() {
        const payload = clone(samplePayloads.commands.start);
        return request(app).post('/webhook/telegram/secret').send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'reply_markup');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("Hello " + payload.message.chat.first_name);
            expect(res.body.reply_markup.length).to.be.greaterThan(1);
        });
    });

    it('Subscribe user to all services #unfinished', function() {
        const payload = clone(samplePayloads.commands.subscribe);

        return request(app).post('/webhook/telegram/secret').send(payload)
        .then(res => {
            expect(res.body).to.have.keys('chat_id', 'text', 'reply_markup');

            expect(res.body.chat_id).to.equal(payload.message.chat.id);
            expect(res.body.text).to.have.string("You have subscribed to");
            expect(res.body.reply_markup.length).to.be.greaterThan(1);
        });
    });
});
