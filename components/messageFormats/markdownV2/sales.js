const dateFormatter = require('../../utils/dateFormatter');

module.exports = function(payload) {
    let { date, time } = dateFormatter(payload.date);
    let action = 'bought';
    let text = '';

    let nameStr;
    if(payload.buyer && payload.buyer.name) {
        if(payload.buyer.url) 
            nameStr = `[${ payload.buyer.name }](${ payload.buyer.url })`;
        else
            nameStr = payload.buyer.name;

    } else 
        nameStr = 'An anonymous user';

    let nftName = (payload.url) ? `[${ payload.name }](${ payload.url })` : payload.name;
    text += `${ nameStr } ${ action }`;

    if(payload.transaction && payload.transaction.price)
        text += ` ${ nftName } for ${ payload.transaction.price } on ${ date } (${ time })`;
    else
        text += ` a ${ nftName } token on ${ date } (${ time })`;

    if(payload.price)
        text += `\n${ payload.name } is currently trading at ${ payload.price }`;

    if(payload.creator.url) {
        if(payload.creator.name.slice(-1) == 's')
            text += `\n[View ${ payload.creator.name }' other creations](${ payload.creator.url })\n`;
        else
            text += `\n[View ${ payload.creator.name }'s other creations](${ payload.creator.url })\n`;
    }

    return text;
}
