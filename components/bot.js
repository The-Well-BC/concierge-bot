const commands = require('./commands');

// Messager Platforms, eg twitter, telegram, discord...
const telegram = require('./messenger/telegram');
const twitter = require('./messenger/twitter');

module.exports = {
    receiveMessage(payload, messenger) {
        if(!messenger)
            throw new Error('No messenger specified');

        let messengerFn;

        if(messenger === 'telegram')
            messengerFn = telegram;
        else if (messenger == 'twitter')
            messengerFn = twitter;

        let parsedMessage = messengerFn.parseMessage(payload);

        return commands(parsedMessage, messenger, parsedMessage.formatter)
        .then(res => {
            if(res === true)
                return new Promise.resolve(true);
            else if(res) {
                let message = messengerFn.prepareMessage(res, [ parsedMessage.chatID ])

                if(messenger == 'twitter') {
                    return messengerFn.sendMessage(message[0][0], [parsedMessage.chatID])
                    .then(res => {
                        console.log('SENT DM', res.event.message_create.message_data);
                        return res;
                    });
                } else
                    return message[0][0];
            }
        })
        .catch(err => {
            let mess =  "";
            if(err.message == 'invalid_platform') {
                mess =  parsedMessage.formatter.error(err).invalid_platform;

                let errorMessage =  messengerFn.prepareMessage(mess, [parsedMessage.chatID])[0][0];

                if(messenger == 'telegram')
                    return errorMessage;
                else {
                    return messengerFn.sendMessage(errorMessage, [parsedMessage.chatID])
                }
            }
        });
    }
}
