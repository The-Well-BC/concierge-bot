const chai = require('chai');
const expect = chai.expect;

const sendPhoto = require('../../../components/messenger/telegram/api/sendPhoto');

describe('Telegram API: Send Photo', function() {
    it('Send photo with caption', function() {
        const message = {
            photo: 'https://picsum.photos/200',
            text: `Testing... testing...\nMultiline string\nHowwill bot handle this??
            `, 
            chat_id: 641574672
        }

        return sendPhoto(message)
        .then(res => {
            expect(res).to.not.have.property('error');
            expect(res).to.have.property('ok', true);
            expect(res.result.from).to.have.property('is_bot', true);
        });
    });
});
