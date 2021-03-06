const nftPlatforms = require('../nftTradingPlatforms/platformNames');
const commands = require('./messengerCommands');

module.exports = (creators, messenger) => {
    let text = '';
    let replies = [];

    if( !Array.isArray(creators))
        creators = [ creators ];

    creators.forEach(creator => {
        replies.push({ text: `${ commands.subscribe[messenger] } creator ${ creator.name }` });
        if(creators[0] !== creator)
            text += '\n\n';

        let t = creator.name;

        if(creator.bio && creator.bio.length > 1)
            t += ' - ' + creator.bio;

        if(creator.moniker)
            t += ` (${ creator.moniker })`;

        if(creator.stats) {
            let stat = creator.stats;

            if(stat.products)
                t += `\nNFTs released: ${ creator.stats.products }`;
            if(stat.totalRevenue)
                t += `\nTotal Revenue: ${ stat.totalRevenue }`;
        }

        // t += `\nSubscribe to ${ creator.name }\n__(Bot will alert you when ${ creator.name } releases a drop)__`;


        if(creator.url) { 
            t += `\nView ${ creator.name }'s profile here - ${ creator.url }`;
        }

        text += t;
    });

    // console.log('CREATOR TEXT', text);

    return { text, replies };
}
