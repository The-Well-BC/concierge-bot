const commands = require('../messengerCommands');
const nfts = require('../../nftTradingPlatforms/platformNames');

const subscribePlatforms = require('./subscribe.platforms');
const subscribeEvents = require('./subscribe.events');
const subscribeCreators = require('./subscribe.creators');

module.exports = function(messenger, format, params) {
    let subC = commands.subscribe[messenger ];
    let helpC = commands.help[messenger];

    let helpReplies = [{
        text: commands.subscribe[messenger]
    }, {
        text: helpC + ' subscribe creators'
    }, {
        text: helpC + ' subscribe events'
    }, {
        text: helpC + ' subscription filters'
    }];


    let helpParameter = params;

    if(params == 'subscribe')
        helpParameter = 'subscribe';
    else {
        helpParameter = helpParameter.split(' ')[1];
        helpParameter = helpParameter.toLowerCase();
    }

    let fn;

    switch(helpParameter) {
        case 'subscribe':
            let text = 'You can subscribe to certain creators, events (drops, sales, listings, bids, offers), platforms (Nifty Gateway, SuperRare...).\n\nCombine subscribe commands to create a subscription filter.\nFor example,\n\n';
            if(format === 'plain')
                text += 'subscribe to all drops from creator CryptoKitties on Nifty Gateway.';
            else if(format === 'markdown')
                text += '*subscribe to all drops from creator CryptoKitties on Nifty Gateway*.';
            text += '\n\nUse the options below to find more information on subscription usecases.\nTo view your subscription filters, type subscription filters';

            response = {
                text,
                replies: helpReplies
            }
            break;
        case 'platform':
        case 'platforms':
            fn = subscribePlatforms;
            break;
        case 'events':
        case 'event':
            fn = subscribeEvents;
            break;
        case 'creators':
        case 'creator':
            fn = subscribeCreators;
            break;
        default:
            response = {
                text: 'Don\'t have this help item', replies: helpReplies,
                replies: helpReplies
            }
            break;
    }

    if(fn)
        response = fn(messenger, format);

    return response;
}
