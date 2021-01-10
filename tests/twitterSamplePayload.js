module.exports = {
    chatID: '352654309',
    commands: {
        'start': {
            "for_user_id": "4337869213",
            "direct_message_events": [{
                    "id": "110", 
                    "created_timestamp": "5300",
                    "type": "message_create",
                    "message_create": {
                        target: { recipient_id: '1346809710993879047' },
                        sender_id: '352654309',
                        message_data: {
                            text: '!start',
                            entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] }
                        }
                    }
            }]
        },
        'subscribe': {
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
        }
    }
}
