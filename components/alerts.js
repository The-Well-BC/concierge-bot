const saleText = require('./texts/sales');
const bidText = require('./texts/bids');

module.exports = {
    alertMessage(chatIDs, payload) {
        let platform = payload.platform.charAt(0).toUpperCase() + payload.platform.substring(1);

        let text = '';

        if(payload.action) {
            text += saleText(payload);

        } else if(payload.status) {
            text += bidText(payload);
            /*
        } else {
            text += ` was last seen trading at ${ payload.price } on ${ fullTimeString }.`;
            */
        }

        text += `\nBrand: ${ payload.creator }\n\n_via: ${ platform }_`;
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        let messages = chatIDs.map(o => {
            return {
                chat_id: o,
                text,
                parse_mode: 'MarkdownV2',
                ...(photo != null) && { photo }
            }
        });

        return messages;
    }
}
