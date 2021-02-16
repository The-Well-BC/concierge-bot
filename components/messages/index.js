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
        let text = '', link;

        switch(payload.event) {
            case 'drop':
                text += dropText(payload, format).text;
                link = dropText(payload, format).link;
                break;
            case 'listing':
                text += listingText(payload, format);
                break;
            case 'bid':
            case 'offer':
                text += bidText(payload, format).text;
                link = bidText(payload, format).link;
                break;
            case 'sale':
                text += saleText(payload, format).text;
                link = saleText(payload, format).link;
                break;
            default:
                return null;
        }

        let platform;

        switch(format) {
            case 'plain':
            default:
                text += ' ';
                platform = nftPlatforms[payload.platform].name;
                // text += `via: ${ platform }`;
                text += `#${platform.replace(/\s+/, '')}`
                break;
            case 'markdown':
                text += '\n\n';
                platform = `[${nftPlatforms[payload.platform].name}](${nftPlatforms[payload.platform].url})`;
                text += `via: ${ platform }`;
                break;
            case 'markdownV2':
                text += '\n\n';
                text = text.replace(/\./g, '\\.');

                platform = `[${nftPlatforms[payload.platform].name}](${nftPlatforms[payload.platform].url})`;
                text += `_via: ${ platform }_`;
                break;
        }

        // text += '#NFT';

        let photo = (payload.img != null || undefined) ?
            payload.img : null;

            // console.log('PHOTO URL', photo);

            if(/res\.cloudinary\.com/.test(photo)) {
                if(/\.gif$/.test(photo))
                    photo = photo.replace(/\.gif$/, '.jpg');
                if(/\.mp4$/.test(photo))
                    photo = photo.replace(/\.mp4$/, '.jpg');

                photo = photo.replace(/(\/image\/upload)/, '$1/w_300');
                photo = photo.replace(/(\/video\/upload)/, '$1/w_300');
        } else {
            photo = null;
        }

        return {
            text,
            ...(link) && {link},
            ...(photo != null) && { img: photo }
        }
    }
}
