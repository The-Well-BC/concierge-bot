const commands = require('../messengerCommands');
const nfts = require('../../nftTradingPlatforms/platformNames');

const subscribe = require('./subscribe');
const filter = require('./subscriptionFilter');

module.exports = function(messenger, format, params) {
    let subC = commands.subscribe[messenger ];
    let browseC = commands.browseCreators[messenger ];

    let helpReplies = [
        { text: browseC },
        { text: commands.help[messenger] + ' subscribe' },
        { text: commands.help[messenger] + ' unsubscribe' },
    ];

    let helpC = commands.help[messenger];

    if(!params) {
        response = {
            text: 'The Concierge bot will alert you as soon as there are new drops from a curated list of artists.',
            replies: helpReplies
        }
    } else {
        if(/(subscription filter|filter)/i.test(params))
            response = filter(messenger, format, params);
        else {
            switch(params.split(' ')[0]) {
                case 'subscribe':
                    response = subscribe(messenger, format, params);
                    break;
                case 'unsubscribe':
                    response = { text: `Text ${commands.unsubscribe[messenger]} to stop receiving all messages` };
                    break;
                default:
                    response = {text: 'Don\'t have this help item', replies: helpReplies}
                    break;
            }
        }
    }

    return response;
}
