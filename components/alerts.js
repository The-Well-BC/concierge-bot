module.exports = {
    alertMessage(chatIDs, payload) {
        let date = new Date(payload.date);
        let months = 'January February March April May June July August September October November December';

        let dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
        let text = `${ payload.name } dropped on ${ dateStr }.\nIt is currently trading at ${ payload.price }`;
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        let messages = chatIDs.map(o => {
            return {
                chat_id: o,
                text,
                ...(photo != null) && { photo }
            }
        });

        return messages;
    }
}
