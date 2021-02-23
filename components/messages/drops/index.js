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
    if(creator || payload.creator) {
        if(creator)
            text += creator;
        else if (payload.creator && payload.creator.wallet) {
            let addr = payload.creator.wallet.address;

            if(addr) 
                text += addr.substring(0, 5) + '...' + addr.slice(-3);
        }

        text += ` just released ${ product }`;

    } else
        text += `${ product } was just released`;

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
