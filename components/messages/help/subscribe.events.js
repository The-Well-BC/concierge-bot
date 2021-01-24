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
        case 'markdownV2':
            p1 = `*${ subscribeC }*`;
            p2 = `*${ subscribeC } <platform>*`;
            p3 = `*${ subscribeC } SuperRare*`;
            break;
    }

    let replies = Object.keys(nfts).map(i => {
        return { text: subscribeC + ' ' + i };
    });

    let text = `You can subscribe to receive alerts whenever certain events occur.\nEvents you can subscribe to include: Sales, Listings, Bids, Offers and Drops/Releases. To subscribe to one or more events, for example sales and drops, type ${ subscribeC } sales, drops.`;

    return {
        text,
        replies
    }
}
