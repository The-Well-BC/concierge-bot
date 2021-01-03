const prepMessage = require('../../../components/messenger/telegram/prepareMessages');
const chai = require('chai');

const expect = chai.expect;

describe('Telegram functions: Prepary payload for telegram', function() {
    let chatIDs = [{ chat_id: 1234 }];

    it('Check all properties', function() {
        let payload = [{
            text: 'This is sample text'
        }]

        let response =  prepMessage(payload, chatIDs)[0][0];

        expect(response).to.containSubset({
            chat_id: 1234,
            parse_mode: 'Markdown',
            method: 'sendMessage'
        });
    });

    it('Checks keys: text', function() {
        let payload = [{
            text: 'This is sample text'
        }]

        let response =  prepMessage(payload, chatIDs)[0][0];

        expect(response).to.have.keys('chat_id', 'text', 'parse_mode', 'method');

        expect(response).to.have.property('text', 'This is sample text');
    });

    it('Checks keys: replies', function() {
        let payload = [{
            text: 'This is sample text',
            replies: [
                {text: '123'}
            ]
        }]

        let response =  prepMessage(payload, chatIDs)[0][0];

        expect(response).to.have.keys('chat_id', 'text', 'reply_markup', 'parse_mode', 'method');

        expect(response.reply_markup).to.deep.eql({
            keyboard: [ [
                {text: '123' }
            ]]
        });
    });

});
