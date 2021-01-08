const { parseMessage } = require('../../../components/messenger/twitter');

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

describe('Twitter functions', function() {
    it('Test command with no params', function() {
        let payload = {
            "for_user_id": "4337869213",
            "direct_message_events": [{
                    "id": "110", 
                    "created_timestamp": "5300",
                    "type": "message_create",
                    "message_create": {
                        target: { recipient_id: '1346809710993879047' },
                        sender_id: '352654309',
                        message_data: {
                            text: '!subscribe',
                            entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] }
                        }
                    }
            }]
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            chatID: '352654309',
            command: { name: 'subscribe' }
        });
    });

    it('Test command with params', function() {
        let payload = {
            "for_user_id": "4337869213",
            "direct_message_events": [{
                    "id": "110", 
                    "created_timestamp": "5300",
                    "type": "message_create",
                    "message_create": {
                        target: { recipient_id: '1346809710993879047' },
                        sender_id: 1234,
                        message_data: {
                            text: '!stoked foo bar',
                            entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] }
                        }
                    }
            }]
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            chatID: 1234,
            command: {
                name: 'stoked',
                params: ['foo', 'bar']
            }
        });
    });

    it('Test subscribe command with no params', function() {
        let payload = {
            "for_user_id": "4337869213",
            "direct_message_events": [{
                    "id": "110", 
                    "created_timestamp": "5300",
                    "type": "message_create",
                    "message_create": {
                        target: { recipient_id: '1346809710993879047' },
                        sender_id: 1234,
                        message_data: {
                            text: '!subscribe',
                            entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] }
                        }
                    }
            }]
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            chatID: 1234,
            command: {
                name: 'subscribe',
                params: 'all'
            }
        });
    });
});
