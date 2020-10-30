const chai = require('chai');
const expect = chai.expect;

const sendPhoto = require('../../components/sendPhoto');

describe('#dev Send Photo', function() {
    it('Send photo with caption', function() {
        const message = {
            url: 'https://picsum.photos/200',
            text: `Testing... testing...
                Multiline string
                Howwill bot handle this??
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
