module.exports = {
    alertMessage(chatIDs, payload) {
        let date = payload.date || payload.releaseDate;
        date = new Date(date);
        let months = 'January February March April May June July August September October November December';
        let platform = payload.service.charAt(0).toUpperCase() + payload.service.substring(1);

        let dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        let hr = date.getUTCHours();
        let min = date.getMinutes();
        console.log('DATE', date, '\nMIN', min);
        min = min.toString();;
        console.log('MIN STRING: ', min, ' LNGTH', min.length);
        min = (min.length < 2) ? min + '0' : min;
        let timeString = (hr < 12) ? `${hr}:${min}am` : `${hr - 12}:${min}pm`;
        timeString += ' UTC';

        let fullTimeString = `${ dateStr } (${ timeString })`;

        let text = payload.name;

        if(payload.action) {
            let action = ( payload.action.match(/sell/i) ) ?
                'sold' : 
                (payload.action.match(/buy/i)) ? 'bought' :
                'redeemed';

            text += ` was ${ action } on ${ dateStr } (${ timeString }).\nIt is currently trading at ${ payload.price }`;
        } else if(payload.status) {
            if(payload.status.match(/close/i)) {
                if(payload.closedOn) {
                    date = new Date(payload.closedOn);
                    dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
                }
                text += ` closed on ${ dateStr } (${ timeString }) at a price of ${ payload.price }.`;
            } else {
                text += ` opened on ${ dateStr } (${ timeString }) at a price of ${ payload.price }.\nIt is currently trading at ${ payload.minBid || payload.price }.`;
            }
        } else {
            text += ` was last seen trading at ${ payload.price } on ${ fullTimeString }.`;
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
