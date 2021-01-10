const saleText = require('./sales');
const bidText = require('./bids');
const dropText = require('./drops');

const start = require('./message.start');
const help = require('./messages.help');

module.exports = {
    start,
    help,

    alertMessage(payload) {
        let platform = payload.platform.charAt(0).toUpperCase() + payload.platform.substring(1);

        let text = '';

        if(payload.type === 'drop') 
            text += dropText(payload)
        else if(payload.type === 'listing') 
            text += bidText(payload)
        else if(payload.action) {
            text += saleText(payload);

        } else if(payload.status) {
            text += bidText(payload);
        }

        text += `\n_via: ${ platform }_`;

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return {
            text,
            ...(photo != null) && { photo }
        }
    }
}
