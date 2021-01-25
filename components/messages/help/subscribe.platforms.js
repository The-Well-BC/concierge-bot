const commands = require('../messengerCommands');
const nfts = require('../../nftTradingPlatforms/platformNames');

module.exports = (messenger, format) => {
    let helpC = commands.help[messenger];
    let subscribeC = commands.subscribe[messenger];

    let subC;

    //placeholders
    let p1, p2, p3;

    switch(format) {
        case 'plain':
            p1 = `${ subscribeC }`;
            p2 = `${ subscribeC } <platform>`;
            p3 = `${ subscribeC } SuperRare`;
            break;
        case 'markdown':
            p1 = `*${ subscribeC }*`;
            p2 = `*${ subscribeC } <platform>*`;
            p3 = `*${ subscribeC } SuperRare*`;
            break;
    }

    let replies = Object.keys(nfts).map(i => {
        return { text: subscribeC + ' ' + i };
    });

    let text = `You can choose to subscribe to alerts from only certain platforms.\nTo subscribe to all platforms, simply type ${ p1 }.\nTo subscribe to alerts from a particular platform, just type ${ p2 }.\nFor example, if you would like to receive updates from SuperRare, type ${ p3 }.`;

    return {
        text,
        replies
    }
}
