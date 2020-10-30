const commands = require('./commands');
const botMessages = require('./botMessages');

module.exports = {
    receiveMessage(payload) {
        return commands.runCommand(payload)
        .then(res => {
            if( res === false )
                return botMessages.prepareFailMessage(payload);
            else {
                let additionalMessage;
                if(res !== true)
                    additionalMessage = res;
                let message = botMessages.prepareResponse(payload, additionalMessage)
                message.method = 'sendMessage';
                return message;
            }
        });
    }
}
