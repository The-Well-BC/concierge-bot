const nftPlatforms = require('../../nftTradingPlatforms/platformNames');
const commands = require('../../commands/text');

module.exports = (creators, messenger) => {
    let text = '';
    let replies = [];

    if( !Array.isArray(creators))
        creators = [ creators ];

    creators.forEach(creator => {
        replies.push({ text: `${ commands.subscribe[messenger] } creator "${ creator.name }"` });
        if(creators[0] !== creator)
            text += '\n\n';

        let t = creator.name;

        if(creator.moniker)
            t += ` (${ creator.moniker })`;

        if(creator.url)
            t = `[${ t }](${ creator.url })`;

        if(creator.stats) {
            let stat = creator.stats;

            if(stat.products)
                t += `\nNFTs released: ${ creator.stats.products }`;
            if(stat.totalRevenue)
                t += `\nTotal Revenue: ${ stat.totalRevenue }`;
        }

        // t += `\nSubscribe to ${ creator.name }\n__(Bot will alert you when ${ creator.name } releases a drop)__`;


        text += t;
    });

    return { text, replies };
}
