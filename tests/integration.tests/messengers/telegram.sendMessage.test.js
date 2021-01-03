const chai = require('chai');
const expect = chai.expect;

const telegram = require('../../../components/messenger/telegram');

describe('Send Telegram Messsage', function() {
    it('Send text message', function() {
        const message = {
            text: `Testing new string...\nHowwill bot handle this??`, 
            chat_id: 641574672
        }

        return telegram.sendMessage(message, ['641574672'])
        .then(res => {
            console.log('response', res);
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);

            expect(res.result.chat.id).to.equal(641574672);
            expect(res.result.text).to.equal(message.text);

            expect(res).to.not.have.property('error');
        });
    });
    it('Send photo with caption', function() {
        const message = {
            img: 'https://picsum.photos/200',
            text: `Testing... testing...\nMultiline string\nHowwill bot handle this??`, 
            chat_id: 641574672
        }

        return telegram.sendMessage(message, ['641574672'])
        .then(res => {
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);

            expect(res.result.chat.id).to.equal(641574672);
            expect(res.result).to.have.property('caption', message.text);
            expect(res.result).to.have.property('photo');

            expect(res).to.not.have.property('error');
        });
    });
});

