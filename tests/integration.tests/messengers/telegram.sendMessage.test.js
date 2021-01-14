const chai = require('chai');
const expect = chai.expect;

const telegram = require('../../../components/messenger/telegram');

describe('Send Telegram Messsage', function() {
    it('Send text message: chat ID', function() {
        const message = {
            text: `Testing telegram message method.\nTesting new lines`
        }

        return telegram.sendMessage(message, ['641574672'])
        .then(res => {
            expect(res).to.all.satisfy(item => {
                expect(item).to.have.property('ok', true);
                expect(item.result.from).to.have.property('is_bot', true);
                expect(item.result.chat.id).to.equal(641574672);
                expect(item.result.text).to.equal(message.text);

                expect(item).to.not.have.property('error');

                return true;
            });
        });
    });

    it('Send text message to multiple chat IDs', function() {
        const messages = [{
            text: `Test: Send message to two chats on telegram`
        }]

        const chatIDs = [641574672, 659038858]

        return telegram.sendMessage(messages, chatIDs)
        .then(res => {
            expect(res).to.satisfy(arr => {

                let message1 = arr.some(item => {
                    return item.result.chat.id === chatIDs[0];
                });

                let message2 = arr.some(item => {
                    return item.result.chat.id === chatIDs[1];
                });

                expect(message1 && message2).to.be.true;

                let general = arr.every(item => {
                    expect(item).to.have.property('ok', true);
                    expect(item.result.from).to.have.property('is_bot', true);
                    expect(item.result.text).to.equal(messages[0].text);

                    expect(item).to.not.have.property('error');
                });

                return true;
            });
        });
    });
});
