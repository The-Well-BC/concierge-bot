module.exports = function(chatIDs, payloadArr) {
    return payloadArr.map(payload => {
        let photo = (payload.img != null || undefined) ?
            payload.img : null;

        console.log('PAYLOAD', payload);
        console.log('CHA IDS', chatIDs);

        return chatIDs.map(o => {
            return {
                chat_id: o.chat_id,
                text: payload.text,
                parse_mode: 'Markdown',
                ...(photo != null) && { photo }
            }
        });
    });
}
