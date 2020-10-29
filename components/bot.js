const commands = require('./commands');
const botMessages = require('./botMessages');

module.exports = {
    receiveMessage(payload) {
        return commands.runCommand(payload)
        .then(res => {
            if( res === false )
                return false
            else {
                let additionalMessage;
                if(res !== true)
                    additionalMessage = res;
                return botMessages.prepareResponse(payload, additionalMessage);
            }
        });
    }
}
