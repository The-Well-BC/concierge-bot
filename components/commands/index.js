const subscribeCommand = require('./command.subscribe');
let nftPlatforms = require('../nftTradingPlatforms/platformNames');
const browse = require('./command.browse');

const commands = require('./text');

module.exports = (payload, messenger, formatter) => {
    let response;
    switch(payload.command.name) {
        case 'browse':
            return browse(payload, messenger, formatter, commands)
            .then(res => {
                return res;
            });
        case 'subscribe':
            return subscribe(payload.command.params, messenger, payload.chatID)
            .then(res => {
                let names;
                if(payload.command.params == 'all')
                    names = 'all'
                else
                    names = payload.command.params.map( item => nftPlatforms[item] );

                response = formatter.subscribe(names);
                return response;
            })
            .catch(e => {
                throw e;
            });

        case 'start':
            let name = (payload.user) ? payload.user.name || payload.user.username : null;

            response = formatter.start(name);
            break;

        case 'help':
            if(!payload.command.params)
                response = formatter.help.main;
            else if(!formatter.help[payload.command.params[0]])
                response = formatter.help.default;
            else
                response = formatter.help[payload.command.params[0]];
            break;
        default:
            break;
    }

    return Promise.resolve(response);
}
