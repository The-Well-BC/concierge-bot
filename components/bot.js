const commands = require('./commands');
const errMessages = require('./errorMessages');

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

        console.log('MESSENGERMF', messengerFn);

        let parsedMessage = messengerFn.parseMessage(payload);

        return commands(parsedMessage, messenger, parsedMessage.formatter)
        .then(res => {
            if(res === true)
                return new Promise.resolve(true);
            else if(res) {
                let message = messengerFn.prepareMessage(res, [ parsedMessage.chatID ])
                if(messenger == 'twitter')
                    return messengerFn.sendMessage({ text: message }, [parsedMessage.chatID]);
                return message[0][0];
            }
        })
        .catch(err => {
            console.log('CHAT ID', parsedMessage.chatID);
            let mess =  "";
            if(err.message == 'invalid_platform') {
                if(err.messenger == 'telegram') {
                    mess =  errMessages(err).invalid_platform[messenger];
                }

                return messengerFn.prepareMessage({ text: mess }, [parsedMessage.chatID])[0][0];
            }
        });
    }
}
