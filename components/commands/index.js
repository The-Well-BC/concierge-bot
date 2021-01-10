const subscribeCommand = require('./command.subscribe');
let nftPlatforms = require('../nftTradingPlatforms/platformNames');
const browse = require('./command.browse');

const messengerCommands = require('./text');

module.exports = (payload, messenger, formatter) => {
    let response;
    switch(payload.command.name) {
        case 'browse':
            return browse(payload, messenger, formatter, messengerCommands)
        case 'subscribe':
            const subscribe = subscribeCommand.subscribe;
            let params;
            if(!payload.command.params)
                params = 'all';
            else
                params = payload.command.params;

            return subscribe(params, messenger, payload.chatID)
            .then(res => {
                let names;
                if(params == 'all')
                    names = 'all'
                else
                    names = payload.command.params.map( item => nftPlatforms[item] );

                response = formatter.subscribe(names, messengerCommands);
                return response;
            })
            .catch(e => {
                throw e;
            });

        case 'start':
            let name = (payload.user) ? payload.user.name || payload.user.username : null;

            response = formatter.start(name, messenger);
            break;

        case 'help':
            if(!payload.command.params)
                response = formatter.help(messenger).main;
            else if(!formatter.help(messenger)[payload.command.params[0]])
                response = formatter.help(messenger).default;
            else
                response = formatter.help(messenger)[payload.command.params[0]];
            break;
        default:
            response = formatter.error().badCommand;
            console.log('Commandn ot recoginzed', response);
            break;
    }

    return Promise.resolve(response);
}
