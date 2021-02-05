const commands = require('../messengerCommands');
const nfts = require('../../nftTradingPlatforms/platformNames');

const subscribe = require('./subscribe');

module.exports = function(messenger, format, params) {
    let subC = commands.subscribe[messenger ];

    let helpReplies = [
        { text: commands.help[messenger] + ' subscribe' },
        { text: commands.help[messenger] + ' unsubscribe' },
    ];

    let helpC = commands.help[messenger];

    let subscribeReplies = [{
        text: commands.subscribe[messenger]
    }, {
        text: helpC + ' subscribe creators'
    }, {
        text: helpC + ' subscribe events'
    }, {
        text: helpC + ' subscribe platforms'
    }];

    if(!params) {
        response = {
            text: 'Trade Drop Bot will alert you to transactions and new drops on NFT trading platforms. Currently, it supports Nifty Gateway and SuperRare',
            replies: helpReplies
        }
    } else {
        switch(params.split(' ')[0]) {
            case 'subscribe':
                response = subscribe(messenger, format, params);
                break;
            case 'unsubscribe':
                console.log('MESSENGER', messenger);
                response = { text: `Text ${commands.unsubscribe[messenger]} to stop receiving all messages` };
                break;
            default:
                response = {text: 'Don\'t have this help item', replies: helpReplies}
                break;
        }
    }

    return response;
}
