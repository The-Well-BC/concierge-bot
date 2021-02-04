const listingText = require('./listings');
const saleText = require('./sales');
const bidText = require('./bids');
const dropText = require('./drops');

const help = require('./help');
const start = require('./messages.start');
const browse = require('./messages.browse');
const subscribe = require('./messages.subscribe');
const unsubscribe = require('./messages.unsubscribe');
const creatorSummary = require('./text.creatorSummary.js');
const error = require('./errorMessages');

const nftPlatforms = require('../nftTradingPlatforms/platformNames');

module.exports = {
    creatorSummary,
    unsubscribe,
    subscribe,
    browse,
    start,
    error,
    help,

    alertMessage(payload, format) {
        let text = '';

        switch(payload.event) {
            case 'drop':
                text += dropText(payload, format)
                break;
            case 'listing':
                text += listingText(payload, format)
                break;
            case 'bid':
            case 'offer':
                text += bidText(payload, format)
                break;
            case 'sale':
                text += saleText(payload, format);
                break;
            default:
                return null;
        }

        text += '\n\n';

        let platform;

        switch(format) {
            case 'plain':
            default:
                platform = nftPlatforms[payload.platform].name;
                text += `via: ${ platform }`;
                break;
            case 'markdown':
                platform = `[${nftPlatforms[payload.platform].name}](${nftPlatforms[payload.platform].url})`;
                text += `via: ${ platform }`;
                break;
            case 'markdownV2':
                platform = `[${nftPlatforms[payload.platform].name}](${nftPlatforms[payload.platform].url})`;
                text += `_via: ${ platform }_`;
                break;
        }

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        return {
            text,
            ...(photo != null) && { photo }
        }
    }
}
