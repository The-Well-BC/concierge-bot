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

    let replies = [
        { text: helpC + ' subscribe' },
        { text: helpC + ' subscription filters' }
    ];

    let text = `You can choose to subscribe to one or more creators. To subscribe to a creator, type ${subscribeC} to creator Xen Pluto\n. To subscribe to multiple creators, type ${subscribeC} to creators Xen Pluto, Yen NotPluto.`; 

    return {
        text,
        replies
    }
}
