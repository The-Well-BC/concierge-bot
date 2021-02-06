const prepMessage = require('../../../components/messenger/telegram/prepareMessages');
const chai = require('chai');

const expect = chai.expect;

describe('Telegram functions: Prepary payload for telegram', function() {
    let chatIDs = [ 1234, 5678 ];

    it('Checks keys', function() {
        let payload = [{
            text: 'This is sample text'
        }]

        let response =  prepMessage(payload, chatIDs);

        expect(response).to.all.have.keys('chat_id', 'text', 'parse_mode', 'method');
        expect(response).to.all.have.property('text', 'This is sample text');
    });

    it('Multiple payloads and chatIDs', function() {
        let payload = [{
            text: 'This is sample text'
        }, {
            text: 'This is sample text 2'
        }]

        let response = prepMessage(payload, chatIDs);

        expect(response).to.have.deep.members([{
                chat_id: 1234,
                parse_mode: 'Markdown',
                method: 'sendMessage',
                text: 'This is sample text'
            }, {
                chat_id: 5678,
                parse_mode: 'Markdown',
                method: 'sendMessage',
                text: 'This is sample text'
            }, {
                chat_id: 1234,
                parse_mode: 'Markdown',
                method: 'sendMessage',
                text: 'This is sample text 2'
            }, {
                chat_id: 5678,
                parse_mode: 'Markdown',
                method: 'sendMessage',
                text: 'This is sample text 2'
        }]);
    });

    it('Checks keys: replies', function() {
        let payload = [{
                text: 'This is sample text',
                replies: [
                    {text: '123'},
                    {text: '456'},
                ]
            }, {
                text: 'This is sample text 2',
                replies: [
                    {text: '789'}
                ]
        }]

        let response =  prepMessage(payload, chatIDs);

        expect(response).to.all.have.keys('chat_id', 'text', 'reply_markup', 'parse_mode', 'method');

        expect(response).to.have.deep.members([{
                chat_id: 1234,
                text: 'This is sample text',
                parse_mode: 'Markdown', method: 'sendMessage',

                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [ [ {text: '123' } ], [ {text: '456' } ] ]
                }
            }, {
                chat_id: 5678,
                text: 'This is sample text',
                parse_mode: 'Markdown', method: 'sendMessage',

                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [ {text: '123' } ],
                        [ {text: '456' } ]
                    ]
                }
            }, {
                chat_id: 1234,
                text: 'This is sample text 2',
                parse_mode: 'Markdown', method: 'sendMessage',

                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [ [{text:'789'}] ]
                }
            }, {
                chat_id: 5678,
                text: 'This is sample text 2',
                parse_mode: 'Markdown', method: 'sendMessage',

                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [ [{text:'789'}] ]
                }
        }]);
    });

});
