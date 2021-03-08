const chai = require('chai');
const expect = chai.expect;

const sendMessage = require('../../../components/messenger/telegram/api/sendText');

describe('Telegram API: Send Message', function() {
    it('Send text message', function() {
        const message = {
            text: 'Testing... testing...', 
            chat_id: 641574672,
            reply_markup: {
                keyboard: [
                    [ { text: 'Text one' }],
                    [ 'onethree']
                ]
            }
        }

        return sendMessage(message)
        .then(res => {
            expect(res).to.not.have.property('error');
            expect(res).to.have.property('ok', true);
            expect(res.result).to.have.property('text', 'Testing... testing...');
            expect(res.result.from).to.have.property('is_bot', true);
        });
    });
    it('Test Markdown V2 format', function() {
        const message = {
            text: '⚡\n_Testing\\.\\.\\.: *Testing*\\.\\.\\.[Google](https://www\\.google\\.com) for $80\\.53_',
            chat_id: 641574672,
            parse_mode: 'MarkdownV2',
            reply_markup: {
                keyboard: [
                    [ { text: 'Text one' }],
                    [ 'onethree']
                ]
            }
        }

        return sendMessage(message)
        .then(res => {
            console.log('RESP', res);
            let entities = res.result.entities;
            console.log('ENTITIES', entities);

            expect(entities).to.satisfy(m => {
                return m.some(i => {
                    return m.url === 'https://www.google.com/' 
                            &&
                        m.type === 'text_link';
                        ;
                });
            });
            expect(res).to.not.have.property('error');
            expect(res).to.have.property('ok', true);
            expect(res.result).to.have.property('text', '⚡\nTesting...: Testing...Google for $80.53');
            expect(res.result.from).to.have.property('is_bot', true);
        });
    });
});
