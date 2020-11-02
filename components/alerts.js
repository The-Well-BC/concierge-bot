module.exports = {
    alertMessage(chatIDs, payload) {
        let date = new Date(payload.date);
        let months = 'January February March April May June July August September October November December';
        let platform = payload.service.charAt(0).toUpperCase() + payload.service.substring(1);

        let dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

        let text = payload.name;

        if(payload.action) {
            let action = ( payload.action.match(/sell/i) ) ?
                'sold' : 
                (payload.action.match(/buy/i)) ? 'bought' :
                'redeemed';

            text += ` was ${ action } on ${ dateStr }.\nIt is currently trading at ${ payload.price }`;
        } else if(payload.status) {
            if(payload.status.match(/close/i)) {
                if(payload.closedOn) {
                    date = new Date(payload.closedOn);
                    dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                }
                text += ` closed on ${ dateStr } at a price of ${ payload.price }.`;
            } else {
                text += ` opened on ${ dateStr } at a price of ${ payload.price }.\nIt is currently trading at ${ payload.minBid || payload.price }.`;
            }
        }

        text += `\nBrand: ${ payload.brand }\n\n_via: ${ platform }_`;
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        let messages = chatIDs.map(o => {
            return {
                chat_id: o,
                text,
                parse_mode: 'Markdown',
                ...(photo != null) && { photo }
            }
        });

        return messages;
    }
}
