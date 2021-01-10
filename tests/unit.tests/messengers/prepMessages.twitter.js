const prepMessage = require('../../../components/messenger/twitter/prepareMessage');
const chai = require('chai');

const expect = chai.expect;

describe('Twitter functions: Prepary payload for twitter', function() {
    let chatIDs = [ 1234 ];

    describe('Prepare for tweet', function() {
        it('Check all properties', function() {
            let payload = [{
                text: 'This is sample text',
                private: true
            }]

            let response =  prepMessage(payload, chatIDs)[0][0];

            expect(response).to.eql({
                chatID: 1234,
                text: 'This is sample text'
            });
        });
    });

    describe('Prepare for private message', function() {
        it('Check all properties', function() {
            let payload = [{
                text: 'This is sample text',
                private: true
            }]

            let response =  prepMessage(payload, chatIDs)[0][0];

            expect(response).to.eql({
                chatID: 1234,
                text: 'This is sample text'
            });
        });
    });

    it('Checks keys: text', function() {
        let payload = [{
            text: 'This is sample text'
        }]

        let response =  prepMessage(payload, chatIDs)[0][0];

        expect(response).to.have.property('text', 'This is sample text');
        expect(response.text).to.not.have.string('\nIf you don\'t see the predefined responses, click the hamburger menu beside the text input field (three horizontal bars to bring them up');
    });

    it('Checks keys: replies', function() {
        let payload = [{
            text: 'This is sample text',
            replies: [
                {text: '123'},
                {text: '456'},
                {text: '789'}
            ]
        }]

        let response =  prepMessage(payload, chatIDs)[0][0];

        expect(response).to.have.keys('chatID', 'text', 'quick_reply');

        expect(response.text).to.have.string('\nIf you don\'t see the predefined responses, click the hamburger menu beside the text input field (three horizontal bars to see them');

        expect(response.quick_reply).to.deep.eql({
            type: 'options',
            options: [{
                    label: '123'
                }, {
                    label: '456'
                }, {
                    label: '789'
            }]
        });
    });

});
