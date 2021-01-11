const prepMessage = require('../../../components/messenger/twitter/prepareMessage');
const chai = require('chai');

const expect = chai.expect;

describe('Twitter functions: Prepary payload for twitter', function() {
    describe('With single message payload', function() {
        it('With regular chatIDs', function() {
            let chatIDs = [ 1234 ];

            let payload = [{
                text: 'This is sample text',
            }]

            let response =  prepMessage(payload, ['12345', '5678']);

            expect(response).to.have.deep.members([{
                    chatID: '12345',
                    text: 'This is sample text',
                }, {
                    chatID: '5678',
                    text: 'This is sample text',
            }]);
        });

        it('When one of the chatIDs is \'all\'', function() {
            let payload = [{
                text: 'This is sample text',
            }]

            let response =  prepMessage(payload, ['12345', '5678', 'all']);

            console.log('RESPONSE', response);

            expect(response).to.have.deep.members([
                {
                    text: 'This is sample text',
                    chatID: 'all'
                }, {
                    chatID: '12345',
                    text: 'This is sample text',
                }, {
                    chatID: '5678',
                    text: 'This is sample text',
                }
            ]);
        });

        it('Checks keys: replies', function() {
            let chatIDs = [ 1234, 5678 ];

            let payload = [{
                text: 'This is sample text',
                replies: [
                    {text: '123'},
                    {text: '456'},
                    {text: '789'}
                ]
            }]

            let response =  prepMessage(payload, chatIDs);

            expect(response).to.all.include.keys('chatID', 'text', 'quick_reply');

            expect(response).to.have.deep.members([{
                    chatID: 1234,
                    text: 'This is sample text\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (the three horizontal bars) to see them',
                    quick_reply:{
                        type: 'options',
                        options: [{
                                label: '123'
                            }, {
                                label: '456'
                            }, {
                                label: '789'
                        }]
                    }
                }, {
                    chatID: 5678,
                    text: 'This is sample text\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (the three horizontal bars) to see them',
                    quick_reply:{
                        type: 'options',
                        options: [{
                                label: '123'
                            }, {
                                label: '456'
                            }, {
                                label: '789'
                        }]
                    }
            }]);
        });
    });

    describe('With multiple payloads', function() {
        let chatIDs = [ 1234 ];

        it('Single chatID', function() {
            let payload = [{
                text: 'This is sample text',
            }, {
                text: 'This is sample text 2'
            }]

            let response =  prepMessage(payload, chatIDs);

            expect(response).to.have.deep.members([{
                    chatID: 1234,
                    text: 'This is sample text'
                }, {
                    chatID: 1234,
                    text: 'This is sample text 2'
            }]);
        });

        it('Checks keys: replies', function() {
            let chatIDs = [ 1234 ];

            let payload = [{
                    text: 'This is sample text',
                    replies: [{text: '123'}]
                }, {
                    text: 'This is sample text',
                    replies: [
                        {text: '013'},
                        {text: '45'}
                    ]

            }]

            let response =  prepMessage(payload, chatIDs);

            expect(response).to.all.include.keys('chatID', 'text', 'quick_reply');

            expect(response).to.have.deep.members([{
                    chatID: 1234,
                    text: 'This is sample text\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (the three horizontal bars) to see them',
                    quick_reply:{
                        type: 'options',
                        options: [{label: '123'}]
                    }
                }, {
                    chatID: 1234,
                    text: 'This is sample text\n\nHint: If you don\'t see the predefined responses, click the hamburger menu beside the text input field (the three horizontal bars) to see them',
                    quick_reply:{
                        type: 'options',
                        options: [{
                                label: '013'
                            }, {
                                label: '45'
                        }]
                    }
            }]);
        });
    });
});
