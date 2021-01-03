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
        let platform = payload.platform.charAt(0).toUpperCase() + payload.platform.substring(1);

        let text = '';

        switch(payload.event) {
            case 'drop':
                text += dropText(payload)
                break;
            case 'listing':
                text += bidText(payload)
                break;
            case 'sale':
                text += saleText(payload);
                break;
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
