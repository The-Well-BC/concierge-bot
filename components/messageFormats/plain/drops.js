const dateFormatter = require('../../utils/dateFormatter');

module.exports = function(payload) {
    let { date, time } = dateFormatter(payload.date);
    let creator = '';

    if(payload.creator.name) {
        creator = `${ payload.creator.name }`;

        if(payload.creator.url)
            creator = `${ payload.creator.name }(${ payload.creator.url })`;
    }

    let product = `${ payload.name }(${ payload.url })`;


    let text = `${ creator } released ${ product } on ${ date } (${ time }).`;

    if(payload.price)
        text += `\nStarting price is ${ payload.price }`;

    return text;
}
