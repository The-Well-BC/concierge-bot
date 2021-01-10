const listingText = require('./listings');
const saleText = require('./sales');
const bidText = require('./bids');
const dropText = require('./drops');

const help = require('./messages.help');
const start = require('./messages.start');
const browse = require('./messages.browse');
const subscribe = require('./messages.subscribe');
const creatorSummary = require('./text.creatorSummary.js');
const error = require('./errorMessages');

const nftPlatforms = require('../../nftTradingPlatforms/platformNames');

module.exports = {
    creatorSummary,
    subscribe,
    browse,
    start,
    error,
    help,

    alertMessage(payload) {
        let platform = nftPlatforms[payload.platform].name;

        let text = '';

        switch(payload.event) {
            case 'drop':
                text += dropText(payload)
                break;
            case 'listing':
                text += listingText(payload)
                break;
            case 'bid':
            case 'offer':
                text += bidText(payload)
                break;
            case 'sale':
                text += saleText(payload);
                break;
        }

        text += `\n\nvia: ${ platform }`;

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return {
            text,
            ...(photo != null) && { photo }
        }
    }
}
