const { parseMessage } = require('../../../components/messenger/telegram');

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

describe('Telegram functions', function() {
    it('Should return user details', function() {
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
                    id:1234,
                    "first_name":"Adesuwa",
                    "username":"littlezigy",
                    "type":"private"
                },
                "date":1603967034,
                "text":"/start",
                "entities":[
                    { "offset":0,"length":6,"type":"bot_command"}
                ]
            }
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            user: {
                name: 'Adesuwa',
                username: 'littlezigy'
            }
        });
    });
    it('Test command with no params', function() {
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
                    id:1234,
                    "first_name":"Adesuwa",
                    "username":"littlezigy",
                    "type":"private"
                },
                "date":1603967034,
                "text":"/start",
                "entities":[
                    { "offset":0,"length":6,"type":"bot_command"}
                ]
            }
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            chatID: 1234,
            command: { name: 'start' }
        });
    });
    it('Test command with params', function() {
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
                "text":"/stoked foo bar",
                "entities":[
                    { "offset":0,"length":6,"type":"bot_command"}
                ]
            }
        };

        let response =  parseMessage(payload);

        expect(response).to.containSubset({
            chatID: 1234,
            command: {
                name: 'stoked',
                params: 'foo bar'
            }
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
