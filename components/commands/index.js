const subscribeCommand = require('./command.subscribe');
const unsubscribeCommand = require('./command.unsubscribe');
const filter = require('./command.filter');

let nftPlatforms = require('../nftTradingPlatforms/platformNames');
const browse = require('./command.browse');

const messengerCommands = require('./text');

const formatter = require('../messages');

module.exports = (payload, messenger) => {
    let response, format = payload.format;

    if(payload.command.params && Array.isArray(payload.command.params))
        throw new Error('Command params should be a string');

    switch(payload.command.name) {
        case 'browse':
            return browse(payload, messenger, formatter, messengerCommands)

        case 'filter':
        case 'filters':
            return filter(payload.chatID, messenger, payload.command.params);
            break;
        case 'subscribe':
            const subscribe = subscribeCommand.subscribe;
            let params;
            if(!payload.command.params)
                params = 'all';
            else
                params = payload.command.params;

            return subscribe(params, messenger, payload.chatID)
            .then(res => {
                let subFilters = {};
                if(params == 'all')
                    subFilters = 'all'
                else {
                    subFilters = {...res.filters }
                }
                let mc = { };
                Object.keys(messengerCommands).forEach(k => 
                    mc[k] = messengerCommands[k][messenger]
                )

                response = formatter.subscribe(subFilters,
                    mc
                );
                return response;
            })
            .catch(e => {
                throw e;
            });

        case 'unsubscribe':
            const unsubscribe = unsubscribeCommand;

            return unsubscribe(messenger, payload.chatID)
            .then(res => {
                return formatter.unsubscribe();
            });
            break;
        case 'start':
            let name = (payload.user) ? payload.user.name || payload.user.username : null;

            response = formatter.start(name, messenger);
            break;

        case 'help':
            response = formatter.help(messenger, format, payload.command.params);
            break;
        default:
            console.log('NOT FOUND');
            response = formatter.error(null, messenger).badCommand;
            break;
    }

    return Promise.resolve(response);
}
