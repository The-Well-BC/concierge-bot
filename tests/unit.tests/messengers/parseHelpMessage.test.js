const telegram = require('../../../components/messenger/telegram');
const twitter = require('../../../components/messenger/twitter');

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

describe('Parse message functions', function() {
    it('Test Help command with different text forms', function() {
        
        let texts = ['help', 'Help', 'help me', 'HELP me', 'hElP'];

        let response = [1,2,3,4].map(i => {
            return telegram.parseMessage({
                "update_id":221739650,
                "message": {
                    "message_id":1,
                    "from": {
                        "id":1234,
                        "is_bot":false,
                        "first_name":"Adesuwa",
                        "username":"littlezigy"
                    },
                    "chat":{
                        id:1234,
                        "first_name":"Adesuwa",
                        "username":"littlezigy",
                        "type":"private"
                    },
                    "date":1603967034,
                    text: texts[i],
                    "entities":[
                        { "offset":0,"length":6,"type":"bot_command"}
                    ]
                }
            });
        });

        response.push(...[1,2,3,4].map(i => {
            return twitter.parseMessage({
                "for_user_id": "4337869213",
                "direct_message_events": [{
                    "id": "110", 
                    "created_timestamp": "5300",
                    "type": "message_create",
                    "message_create": {
                        target: { recipient_id: '1346809710993879047' },
                        sender_id: 1234,
                        message_data: {
                            text: texts[i],
                            entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] }
                        }
                    }
                }]
            });
        }));

        expect(response).to.all.satisfy(message => {
            expect(message).to.containSubset({
                chatID: 1234,
                command: { name: 'help' }
            });

            return true;
        });
    });

    it('Test subscribe command with no params', function() {
        let payload = {
            "update_id":221739650,
            "message": {
                "message_id":1,
                "from": {
                    "id":1234,
                    "is_bot":false,
                    "first_name":"Adesuwa",
                    "username":"littlezigy"
                },
                "chat":{
                    "id":1234,
                    "first_name":"Adesuwa",
                    "username":"littlezigy",
                    "type":"private"
                },
                "date":1603967034,
                "text":"/subscribe",
                "entities":[
                    { "offset":0,"length":6,"type":"bot_command"}
                ]
            }
        };

        let response =  telegram.parseMessage(payload);

        expect(response).to.containSubset({
            chatID: 1234,
            command: {
                name: 'subscribe',
                params: 'all'
            }
        });
    });
});
