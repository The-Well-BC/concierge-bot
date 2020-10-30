module.exports = {
    alertMessage(chatIDs, payload) {
        let text = `${ payload.name } dropped on ${ payload.date }. It is currently trading at $${ payload.price }`;
        let messages = chatIDs.map(o => {
            return {
                chat_id: o,
                text,
            }
        });

        return messages;
    }
}
