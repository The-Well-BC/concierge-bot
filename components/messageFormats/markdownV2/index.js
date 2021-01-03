const saleText = require('./sales');
const bidText = require('./bids');
const dropText = require('./drops');

const help = require('./messages.help');
const start = require('./messages.start');
const subscribe = require('./messages.subscribe');

module.exports = {
    subscribe,
    start,
    help,

    alertMessage(payload) {
        console.log('PAYLOAD', payload);
        let platform = payload.platform.charAt(0).toUpperCase() + payload.platform.substring(1);

        let text = '';

        if(payload.type === 'drop') 
            text += dropText(payload)
        else if(payload.type === 'listing') 
            text += bidText(payload)
        else if(payload.type == 'sale') {
            text += saleText(payload);

        } else if(payload.status) {
            text += bidText(payload);
        }

        text += `\n_via: ${ platform }_`;

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return {
            text,
            parse_mode: 'MarkdownV2',
            ...(photo != null) && { photo }
        }
    }
}
