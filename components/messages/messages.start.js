const commands = require('./messengerCommands');
const nfts = require('../nftTradingPlatforms/platformNames');

module.exports = (name, messenger) => {
    let subC = commands.subscribe[messenger ];

    let subscribeReplies = [{ text: commands.help[messenger] + ' subscribe' }];
    let text = (name) ? `Hello ${name}` : '';

    text += '\nI\'m here to alert you on products, artwork released by varying artists.\nRight now, you can choose to subscribe to all new releases, or drops. Eventually, you will have artists you look forward to and then you can subscribe to those artists.\nChoose \'Subscribe\' to learn more about the different services you could subscribe to.';
    return {
        text,
        replies: subscribeReplies
    }
}
