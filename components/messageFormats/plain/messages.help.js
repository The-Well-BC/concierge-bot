const commands = require('../messengerCommands');
const nfts = require('../../nftTradingPlatforms/platformNames');

module.exports = (messenger) => {
    let subC = commands.subscribe[messenger ];

    let subscribeReplies = [{ text: commands.subscribe[messenger ] }];
    for(key in nfts) {
        subscribeReplies.push({text: `${ commands.subscribe[messenger] } ${ key }`
             });
    }

    return {
        main:  {
            text: 'Trade Drop Bot will alert you to transactions and new drops on NFT trading platforms. Currently, it supports Nifty Gateway, SuperRare, Foundation and Zora'
        },
        default:  {
            text: 'Don\'t have this help item'
        },
        subscribe: {
            text: `You can subscribe to alerts from only certain platforms. \nTo subscribe to all platforms, simply type ${ subC }. To subscribe to alerts from a particular platform, just type ${ subC } <platform>.\n If you would like to receive updates from Zora instead, type ${ subC } zora.`,
            replies: subscribeReplies
        },

    }
}
