const bot = require('./bot');

module.exports = {
    receiveBotMessage: (req, res) => {
        let messenger;

        if(req.path.split(1) === 'twitter') 
            messenger = 'twitter';
        else 
            messenger = 'telegram';

        return bot.receiveMessage(req.body, messenger)
        .then(result => {
            return res.send(result);
        });
    }
}
