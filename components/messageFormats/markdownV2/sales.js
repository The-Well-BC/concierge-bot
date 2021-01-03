const dateFormatter = require('../../utils/dateFormatter');

module.exports = function(payload) {
    let { date, time } = dateFormatter(payload.date);
    let action = 'bought';
    let text = '';

    if(payload.buyer.name) {
        let nameStr;
        if(payload.buyer.url) 
            nameStr = `[${ payload.buyer.name }](${ payload.buyer.url })`;
        else
            nameStr = payload.buyer.name;

        text += `${ nameStr } just ${ action } ${ payload.name } for ${ payload.price } on ${ date } (${ time })`;
    }

    if(payload.currentPrice)
        text += `\n${ payload.name } is currently trading at ${ payload.currentPrice }`;

    if(payload.creator.url) {
        if(payload.creator.name.slice(-1) == 's')
            text += `\n[View ${ payload.creator.name }' other creations](${ payload.creator.url })\n`;
        else
            text += `\n[View ${ payload.creator.name }'s other creations](${ payload.creator.url })\n`;
    }

    return text;
}
