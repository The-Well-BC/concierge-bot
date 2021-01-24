const dateFormatter = require('../../utils/dateFormatter');

module.exports = function(payload, format) {
    let { date, time } = dateFormatter(payload.date);
    let action = 'bought';
    let text = '';

    let nameStr;

    if(payload.buyer && payload.buyer.name) {
        nameStr = payload.buyer.name;
    } else
        nameStr = 'An anonymous user';

    text += `${ nameStr } ${ action }`;

    if(payload.transaction && payload.transaction.price)
        text += ` ${ payload.name } for ${ payload.transaction.price } on ${ date } (${ time })`;
    else
        text += ` a ${ payload.name } token on ${ date } (${ time })`;

    if(payload.price)
        text += `\n${ payload.name } is currently trading at ${ payload.price }`;

    if(payload.url)
        text += `\nView ${ payload.name } - ${ payload.url }`;

    if(payload.buyer && payload.buyer.name && payload.buyer.url)
        text += `\nView ${ payload.buyer.name }'s profile - ${ payload.buyer.url }`;

    if(payload.creator) {
        if(payload.creator.url && payload.creator.name) {
            if(payload.creator.name.slice(-1) == 's')
                text += `\nView ${ payload.creator.name }' other creations - ${ payload.creator.url }`;
            else
                text += `\nView ${ payload.creator.name }'s other creations - ${ payload.creator.url }`;
        }
    }

    return text;
}
