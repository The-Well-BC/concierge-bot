const markdown = require('./format.markdown');
const plain = require('./format.plain');

module.exports = function(payload, format) {
    let messageData;
    switch(format) {
        case 'markdownv2':
        case 'markdownV2':
        case 'markdown':
            messageData = markdown(payload);
            break;

        case 'plain':
        default:
            messageData = plain(payload);
            break;
    }

    let { creator, product, extras } = messageData;

    let text = '💫 NEW DROP\n', link;
    text += `${ creator } just released ${ product }`;

    /*
    if(messageData.extras && Array.isArray(messageData.extras) && messageData.extras.length > 0) {
        text += '\n';
        messageData.extras.forEach(link => {
            text += '\n' + link;
        });
    }
    */

    if(messageData.link)
        link = messageData.link;
        

    return { text, ...link && {link} };
}
